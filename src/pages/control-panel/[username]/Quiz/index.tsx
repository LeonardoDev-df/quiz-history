import {
    useContext,
    useRef,
    useEffect,
    useState,
    useCallback,
    FocusEvent
} from 'react'
import { ActionMeta, GroupTypeBase, OptionTypeBase } from 'react-select'
import { FormHandles, SubmitHandler } from '@unform/core'
import { ThemeContext } from 'styled-components'
import { GetServerSideProps } from 'next'
import { parseCookies } from 'nookies'
import * as Yup from 'yup'
import axios from 'axios'

import {
    Container,
    Paper,
    FormGroup,
    StButton,
    Copy,
    StForm,
    FormInputContainer
} from '../../../../styles/pages/shared/control-panel.styles'
import { SidebarLayout } from '../../../../components/layouts/sidebar-layout'
import getValidationErrors from '../../../../utils/getValidationErrors'
import { sortArrayObject } from '../../../../utils/sortArrayObject'
import { asyncHandler } from '../../../../utils/asyncHandler'
import { InputMask } from '../../../../components/InputMask'
import { FileForm } from '../../../../components/FileForm'
import { AUTH_TOKEN_KEY } from '../../../../contexts/auth'
import { Loading } from '../../../../components/Loading'
import { Select } from '../../../../components/Select'
import { useToast } from '../../../../hooks/use-toast'
import { Input } from '../../../../components/Input'
import Head from '../../../../infra/components/Head'

interface CepResponse {
    cep: string
    logradouro: string
    complemento: string
    bairro: string
    localidade: string
    uf: string
    unidade: string
    ibge: string
    gia: string
}

interface UFResponse {
    sigla: string
    nome: string
}
interface CityResponse {
    nome: string
}

type OptionProps = readonly (OptionTypeBase | GroupTypeBase<OptionTypeBase>)[]

type FormSiteData = {
    siteName: string
    zipCode: string
    streetAddress: string
    number: string
    complement: string
    province: string
    city: string
    uf: string
}

function Upload({ UFOptions }) {
    const [citySelectOptions, setCitySelectOptions] = useState<OptionProps>()
    const [hasAdvancedUpload, setHasAdvancedUpload] = useState(false)
    const [isFileError, setIsFileError] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [files, setFiles] = useState<FileList>()

    const { colors } = useContext(ThemeContext)
    const { addToast } = useToast()

    const divRef = useRef<HTMLDivElement>(null)
    const formRef = useRef<FormHandles>(null)

    const schema = Yup.object({
        siteName: Yup.string().required('Nome obrigatório'),
        zipCode: Yup.string().required('CEP obrigatório'),
        streetAddress: Yup.string().required('Endereço obrigatório'),
        number: Yup.string().required('Número obrigatório'),
        complement: Yup.string(),
        province: Yup.string().required('Bairro obrigatório'),
        city: Yup.string().required('Cidade obrigatório'),
        uf: Yup.string().required('UF obrigatório')
    })

    const isAdvancedUpload = () => {
        const div = divRef.current
        if (div) {
            return (
                ('draggable' in div ||
                    ('ondragstart' in div && 'ondrop' in div)) &&
                'FormData' in window &&
                'FileReader' in window
            )
        } else {
            return false
        }
    }

    // execute the script above in a useEffect to garantee that is in client-side
    useEffect(() => {
        if (isAdvancedUpload()) {
            setHasAdvancedUpload(true)
        }
    }, [])

    const handleFormSubmit: SubmitHandler<FormSiteData> = useCallback(
        async (data, { reset }) => {
            setIsLoading(true)
            try {
                reset()

                if (!files) {
                    setIsFileError(true)
                    throw new Error('No file encountered')
                }
                setIsFileError(false)

                await schema.validate(data, {
                    abortEarly: false
                })

                const image = files[0]
                // Success validation
                // const formData = new FormData()
                // const imageData = {
                //     type: image.type,
                //     name: image.name,
                //     size: image.size
                // }

                // formData.append('image', image)
                // formData.append('imageData', JSON.stringify(imageData))
                const {
                    city,
                    complement,
                    siteName,
                    streetAddress,
                    province,
                    number,
                    uf,
                    zipCode
                } = data

                const siteData = {
                    imageContentType: image.type,
                    name: siteName,
                    size: image.size,
                    image,
                    address: {
                        city,
                        complement,
                        streetAddress,
                        province,
                        number,
                        uf,
                        zipCode
                    }
                }
                // TODO: API connection
                const response = await axios.post(
                    '/api/historical-sites/create',
                    siteData
                )
                if (response && response.data) {
                    console.log(response.data)
                }
                // TODO: Adicionar os toasts
            } catch (err) {
                if (err instanceof Yup.ValidationError) {
                    // Validation failed
                    const validationErrors = getValidationErrors(err)

                    formRef.current?.setErrors(validationErrors)
                }
            } finally {
                setIsLoading(false)
            }
        },
        [files]
    )

    const handleCepBlur = useCallback(
        async ({ target: { value } }: FocusEvent<HTMLInputElement>) => {
            const cep = value.replace(/\D/g, '')

            if (cep != '') {
                const validacep = /^[0-9]{8}$/

                if (validacep.test(cep)) {
                    // * Habilitar o loading na tela
                    setIsLoading(true)

                    const [response, error] = await asyncHandler(
                        axios.get<CepResponse>(
                            `https://viacep.com.br/ws/${cep}/json/`
                        )
                    )

                    if (response) {
                        const {
                            data: { logradouro, bairro, localidade, uf }
                        } = response

                        formRef.current.setFieldValue(
                            'streetAddress',
                            logradouro
                        )
                        formRef.current.setFieldValue('province', bairro)
                        formRef.current.setFieldValue('uf', uf)
                        const inUfRef = formRef.current.getFieldRef('uf')
                        inUfRef.select.selectOption({ label: uf, value: uf })

                        const inCityRef = formRef.current.getFieldRef('city')
                        inCityRef.select.selectOption({
                            label: localidade,
                            value: localidade
                        })
                    } else {
                        addToast({
                            type: 'error',
                            title: 'Ocorreu um erro ao buscar seus dados',
                            description:
                                'Não conseguimos buscar suas informações a partir do seu cep'
                        })
                    }
                    setIsLoading(false)
                } else {
                    // cep inválido
                    formRef.current.setFieldError('zipCode', 'cep inválido')
                }
            } else {
                // cep sem valor
                formRef.current.setFieldError('zipCode', 'cep é obrigatório')
            }
        },
        []
    )


    const optionsCategory = [
        { value: 'Sítio', label: 'Sítio' },
        { value: 'Monumento', label: 'Monumento' },
        { value: 'Museu', label: 'Museu' }
      ]
    const optionsDificulty = [
        { value: 'Facil', label: 'Fácil' },
        { value: 'Medio', label: 'Médio' },
        { value: 'Dificil', label: 'Difícil' }
      ]
    return (
        <Container>
            <Head title="Upload 3D | RV History" />

            <Paper ref={divRef}>

                <StForm ref={formRef} onSubmit={handleFormSubmit}>

                    <fieldset>
                        <h2>Criar Quiz</h2>
                        <FormGroup mult={true}>
                            <div>
                                <label htmlFor="uf">Selecione a Categoria</label>

                                <Select
                                    options={optionsCategory}
                                    name="uf"
                                    id="uf"
                                    instanceId="uf"
                                    // isSearchable
                                    onChange={''}
                                    placeholder="Selecione..."
                                />
                            </div>

                            <div>
                                <label htmlFor="city">Selecione a dificuldade</label>

                                <Select
                                    options={optionsDificulty}
                                    name="city"
                                    id="city"
                                    instanceId="city"
                                    placeholder="Selecione..."
                                />
                            </div>


                        </FormGroup>

                        <FormGroup mult={true}>
                            <FormInputContainer gridColumn="1 / 4">
                                <label htmlFor="complement">Informe qual será a Pergunta</label>
                                <Input name="complement" id="complement" />
                            </FormInputContainer>

                        </FormGroup>

                        <FormGroup mult={true}>
                            <FormInputContainer gridColumn="1 / 4">
                                <label htmlFor="complement">Informe qual será a Resposta Correta</label>
                                <Input name="complement" id="complement" />
                            </FormInputContainer>

                        </FormGroup><FormGroup mult={true}>
                            <FormInputContainer gridColumn="1 / 4">
                                <label htmlFor="complement">Informe qual será a Resposta</label>
                                <Input name="complement" id="complement" />
                            </FormInputContainer>

                        </FormGroup><FormGroup mult={true}>
                            <FormInputContainer gridColumn="1 / 4">
                                <label htmlFor="complement">Informe qual será a Resposta</label>
                                <Input name="complement" id="complement" />
                            </FormInputContainer>

                        </FormGroup>
                        <FormGroup mult={true}>
                            <FormInputContainer gridColumn="1 / 4">
                                <label htmlFor="complement">Informe qual será a Resposta</label>
                                <Input name="complement" id="complement" />
                            </FormInputContainer>

                        </FormGroup>
                        <h3>Verdadeiro ou Falso</h3>

                        <FormGroup mult={true}>

                            <FormInputContainer gridColumn="1 / 4">

                            <label className='vtt'>Informe qual será a Pergunta</label>
                            <Input name="complement" id="complement" />

                                <div className='flex-container'>
                                    <input type="radio" value="Vdd" name="gender" /> Verdadeiro
                                    <input type="radio" value="False" name="gender" /> Falso
                                </div>

                            </FormInputContainer>

                        </FormGroup>


                    </fieldset>

                    <StButton type="submit" toRight>
                        Enviar
                    </StButton>
                </StForm>
                <Loading isVisible={isLoading} />
            </Paper>

            <Copy>&copy; 2021 RVHistory. All right reserved.</Copy>
        </Container>
    )
}

Upload.Layout = SidebarLayout

export default Upload

export const getServerSideProps: GetServerSideProps = async ctx => {
    // * isAutheticated method
    const { [AUTH_TOKEN_KEY]: token } = parseCookies(ctx)

    if (!token) {
        return {
            redirect: {
                destination: '/',
                permanent: false
            }
        }
    }




    return {
        props: {

        }
    }
}
