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
import { Box, Alert, IconButton, Collapse, Button } from '@mui/material';
import { Close } from '@mui/icons-material'


import {
    ContainerQuiz,
    StFormQuiz,
    StAdd,
    PaperCadastrarQuiz,
    FormGroup,
    FormQuiz,
    StButton,
    Copy,
    Copyn,
    StForm,
    FormInputContainer,
    FormInputContainerQuiz
} from '../../../../styles/pages/shared/control-panel.styles'
import { SidebarLayout } from '../../../../components/layouts/sidebar-layout'
import getValidationErrors from '../../../../utils/getValidationErrors'
import { sortArrayObject } from '../../../../utils/sortArrayObject'
import { asyncHandler } from '../../../../utils/asyncHandler'
import { InputMask } from '../../../../components/InputMask'
import { FileForm } from '../../../../components/FileForm'
import { AUTH_TOKEN_KEY } from '../../../../contexts/auth'
import { Loading } from '../../../../components/Loading'
import { Select } from '../../../../components/SelectQuiz'
import { useToast } from '../../../../hooks/use-toast'
import { Input } from '../../../../components/Input'
import { InputQuiz } from '../../../../components/InputQuiz'
import Head from '../../../../infra/components/Head'
import { Quiz } from '../../../../styles/Icons'




// optional configuration


interface CepResponse {
    cep: string
    categoria: string
    titulo: string
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
    title: string
    category: string

}

function Upload({ UFOptions }) {
    const [citySelectOptions, setCitySelectOptions] = useState<OptionProps>()
    const [hasAdvancedUpload, setHasAdvancedUpload] = useState(false)
    const [isFileError, setIsFileError] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [files, setFiles] = useState<FileList>()
    const [ quizes, setQuizes] = useState([])


    const { colors } = useContext(ThemeContext)
    const { addToast } = useToast()

    const divRef = useRef<HTMLDivElement>(null)
    const formRef = useRef<FormHandles>(null)

    const schema = Yup.object({
        siteName: Yup.string().required(' obrigatório'),
        title: Yup.string().required(' obrigatório'),
        category: Yup.string().required(' obrigatório'),
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

                    siteName,
                    category,
                    title
                } = data

                const siteData = {
                    imageContentType: image.type,
                    name: siteName,
                    size: image.size,
                    image,
                    quiz: {
                        category,
                        title
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

            const optionsCategory = [
                { value: 'Sítio', label: 'Sítio' },
                { value: 'Monumento', label: 'Monumento' },
                { value: 'Museu', label: 'Museu' }
              ]

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
                            data: { logradouro, bairro, localidade, category }
                        } = response

                        formRef.current.setFieldValue(
                            'streetAddress',
                            logradouro
                        )
                        formRef.current.setFieldValue('province', bairro)
                        formRef.current.setFieldValue('category', category)
                        const inCategoryRef = formRef.current.getFieldRef('category')
                        inCategoryRef.select.selectOption({ label: category, value: category })

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
        { value: 'Museu', label: 'Museu' },
        { value: 'Outros', label: 'Outros' }
      ]


    const optionsDificulty = [
        { value: 'Facil', label: 'Fácil' },
        { value: 'Medio', label: 'Médio' },
        { value: 'Dificil', label: 'Difícil' }
      ]

    const addInputButton = (e) => {
        e.preventDefault()

        setQuizes([...quizes, ""]);
    };

    const AlertQuizEditButton = () => {
        setTimeout(function(){
            alert("Cadastro cancelado!");
            window.location.reload();
         }, 3000);
       
      };

    const styles = {

        largeIcon: {
          width: 60,
          height: 60,
        },
      
      };

    const [open, setOpen] = useState(false)
    return (
        <ContainerQuiz>
            <Head title="Upload 3D | RV History" />


            <Copyn>
            <div className='alert'>
                <Collapse in={open}
                >
                        <Alert severity="success" 
                         
                        action={
                            <IconButton
                                size="large"
                                color="inherit"
                                onClick={() => {
                                setOpen(false)
                                
                                }}
                               
                            >                                            
                            </IconButton>                   
                        } 
                                                  
                            >
                            <p>Quiz Cadastrado com sucesso !</p>
                        </Alert>
                </Collapse>
                </div>
            </Copyn>
            

           

            <PaperCadastrarQuiz ref={divRef}>
                <h2>Cadastrar Quiz</h2>
                <StFormQuiz ref={formRef} onSubmit={handleFormSubmit}>

                    <fieldset>
                    <h3></h3>
                        <FormQuiz mult={true}>

                        <div className='Cast'>
                            <div className='Cad'>
                                <label htmlFor="uf">Selecione a Categoria</label>

                                <Select
                                    options={optionsCategory}
                                    name="category"
                                    id="uf"
                                    instanceId="uf"
                                    // isSearchable
                                    onChange={''}
                                    placeholder="Selecione..."
                                />
                            </div>


                            <div className='Cadas'>
                                <FormGroup mult={true}>
                                <FormInputContainer gridColumn=" 1 / 1">
                                    <label htmlFor="complement">Título do Quiz</label>
                                    <Input name="title" id="title" />
                                </FormInputContainer>

                                </FormGroup>
                            </div>


                            <div className='addQuiz'>
                                <label htmlFor="city">Adicionar Quiz</label>
                                <div className='maisQuiz'>
                                <StAdd
                                    onClick={addInputButton}
                                />
                                </div>
                            </div>
                        </div>


                        </FormQuiz>
                    </fieldset>

                </StFormQuiz>
                <Loading isVisible={isLoading} />
            </PaperCadastrarQuiz>


                {quizes.map(quize => (

                    <PaperCadastrarQuiz ref={divRef}>

                    <StFormQuiz ref={formRef} onSubmit={handleFormSubmit}>

                        <fieldset>
                        <h3></h3>
                            <FormQuiz mult={true}>

                            <div className='Casti'>
                                <div className='Cadi'>
                                    <label htmlFor="uf">Selecione a Categoria</label>

                                    <Select
                                        options={optionsCategory}
                                        name="uf"
                                        id="uf"
                                        instanceId="uf"
                                        // isSearchable
                                       
                                        placeholder="Selecione..."
                                    />
                                </div>


                                <div className='Cadas'>
                                    <FormGroup mult={true}>
                                    <FormInputContainer gridColumn=" 1 / 1">
                                        <label htmlFor="complement">Título do Quiz</label>
                                        <Input name="complement" id="complement" />
                                    </FormInputContainer>

                                    </FormGroup>
                                </div>                              
                            </div>

                            </FormQuiz>
                        </fieldset>

                    </StFormQuiz>
                    <Loading isVisible={isLoading} />
                    </PaperCadastrarQuiz>


                ))}
           
                
            <PaperCadastrarQuiz ref={divRef}>


           
                    <div  className='buto'>
                        <div>
                        <StButton             
                        onClick={AlertQuizEditButton}
                        
                        >      
                        CANCELAR
                        </StButton>
                        </div>
                        <div>
                        <StButton 
                            onClick={() => {
                                setOpen(true)
                                setTimeout(function(){
                                    window.location.reload();
                                 }, 7000);
                            }}                                  
                        >
                        CADASTRAR
                        </StButton>
                        </div>

                    </div>

                <Loading isVisible={isLoading} />
            </PaperCadastrarQuiz>


            <Copy>&copy; 2021 RVHistory. All right reserved.</Copy>
        </ContainerQuiz>
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
