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
    ContainerQuiz,
    StFormQuiz,
    StAdd,
    StEdit,
    StSearch,
    StTrashQuize,
    Paper,
    PaperCadastrarQuiz,
    FormGroup,
    FormQuiz,
    StButton,
    Copy,
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
import { InputQuiz } from '../../../../components/InputQuiz'
import { Input } from '../../../../components/Input'
import { InputQuizpesq } from '../../../../components/InputQuizpesq'
import Head from '../../../../infra/components/Head'
import { AiOutlineReload } from 'react-icons/ai'

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
    const [ quizes, setQuizes] = useState([])
    const [ quest, setQuest] = useState([])
    const [ QuizEdit, setQuizEdit] = useState([])

    const { colors } = useContext(ThemeContext)
    const { addToast } = useToast()

    const divRef = useRef<HTMLDivElement>(null)
    const formRef = useRef<FormHandles>(null)

    const schema = Yup.object({
        siteName: Yup.string().required('Nome obrigat??rio'),
        zipCode: Yup.string().required('CEP obrigat??rio'),
        streetAddress: Yup.string().required('Endere??o obrigat??rio'),
        number: Yup.string().required('N??mero obrigat??rio'),
        complement: Yup.string(),
        province: Yup.string().required('Bairro obrigat??rio'),
        city: Yup.string().required('Cidade obrigat??rio'),
        uf: Yup.string().required('UF obrigat??rio')
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
                                'N??o conseguimos buscar suas informa????es a partir do seu cep'
                        })
                    }
                    setIsLoading(false)
                } else {
                    // cep inv??lido
                    formRef.current.setFieldError('zipCode', 'cep inv??lido')
                }
            } else {
                // cep sem valor
                formRef.current.setFieldError('zipCode', 'cep ?? obrigat??rio')
            }
        },
        []
    )


    const optionsCategory = [
        { value: 'S??tio', label: 'S??tio Cultural' },
        { value: 'Monumento', label: 'Monumento' },
        { value: 'Museu', label: 'Museu' },
        { value: 'Outros', label: 'Outros' }
      ]
    const optionsDificulty = [
        { value: 'Catedral', label: 'Catedral' },
        { value: 'Catetinho', label: 'Catetinho' },
        { value: 'Museu Nacional', label: 'Museu Nacional' }
      ]

      const addInputButton = (e) => {
        e.preventDefault()

        setQuizes([...quizes, ""]);
      };

      const addQuestButton = (e) => {
        e.preventDefault()

        setQuest([...quest, ""]);
      };

      const addQuizEditButton = (e) => {
        e.preventDefault()

        setQuizEdit([...QuizEdit, ""]);

        setShow((s) => !s)
      };



      { /* Apagar um campo */ }
       const [show, setShow] = useState(true);

       function refreshPage(){
        window.location.reload();
       }

       function refreshPageafterSave(){
        alert("Dados foram editados com sucesso!")
        window.location.reload();
       }



    return (
        <ContainerQuiz>
            <Head title="Upload 3D | RV History" />

            <PaperCadastrarQuiz ref={divRef}>
                <h2>Quizzes</h2>
                <StFormQuiz ref={formRef} onSubmit={handleFormSubmit} style={{ display: show ? "block" : "none" }}>

                    <fieldset >
                    <h3></h3>
                        <FormQuiz mult={true}>

                        <div className='quist' >

                                <div className='titu'>
                                    <label htmlFor="city">Selecione a categoria</label>

                                    <Select
                                        options={optionsCategory}
                                        name="city"
                                        id="city"
                                        instanceId="city"
                                        placeholder="Selecione..."
                                    />
                                </div>

                                <div  className='titu'>
                                    <label htmlFor="city">Pesquisar</label>
                                        < FormInputContainerQuiz gridColumn="  1/ 2">
                                        <InputQuizpesq name="complement" id="complement" />
                                        </ FormInputContainerQuiz>
                                </div>

                        </div>
                        </FormQuiz>
                    </fieldset>

                    <div className='pesquist'>
                        <StButton type="submit"
                        onClick={addInputButton}>
                        PESQUISAR
                        </StButton>
                    </div>

                </StFormQuiz>
                <Loading isVisible={isLoading} />
            </PaperCadastrarQuiz>

            {quizes.map(quize => (

                <PaperCadastrarQuiz ref={divRef} style={{ display: show ? "block" : "none" }}>

                <StFormQuiz ref={formRef} onSubmit={handleFormSubmit}>

                    <fieldset >
                    <h3>Quizzes</h3>
                    <FormQuiz mult={true}>

                        <div>
                        <div className='pe'>
                                <label htmlFor="uf">T??tulo</label>
                                <Input name="complement" id="complement" value='Nacional' />
                        </div>

                        <div className='pe'>
                                <label htmlFor="uf">Categoria</label>
                                <Input name="complement" id="complement" value='Museu'/>
                        </div>

                        <div className='pes'>
                                <label htmlFor="uf">S??tio Relacionado</label>
                                <Input name="complement" id="complement" value='Museu Nacional' />
                        </div>
                        </div>


                    <div className='organiz'>

                            <div className='listedi'>
                                    <div className='buttonadd'>
                                        <StEdit
                                        onClick={addQuizEditButton}
                                        />
                                    </div>

                                    <div >
                                        <label className='buttonaddicty' htmlFor="city">EDITAR QUIZ&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label>
                                    </div>
                            </div>

                            <div className='listedi'>
                                    <div className='buttonadd'>
                                        <StTrashQuize

                                        />
                                    </div>

                                    <div >
                                        <label className='buttonaddicty' htmlFor="city">EXCLUIR QUIZ&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label>
                                    </div>
                            </div>
                    </div>

                    </FormQuiz>

                    </fieldset>
                </StFormQuiz>


                <Loading isVisible={isLoading} />
                </PaperCadastrarQuiz>

            ))}



            {QuizEdit.map(quizedit => (
            <>

            <PaperCadastrarQuiz ref={divRef}>

            <StFormQuiz ref={formRef} onSubmit={handleFormSubmit}>

                <fieldset>
                <h3>Quizzes</h3>
                <FormGroup mult={true}>

                    <div>
                            <div>
                                <label htmlFor="province">T??tulo</label>
                                <Input name="province" id="province" value='Nacional' />
                            </div>


                            <div>
                                <label htmlFor="uf">Categoria</label>

                                <Select
                                    options={optionsCategory}
                                    name="uf"
                                    id="uf"
                                    instanceId="uf"
                                    // isSearchable

                                    placeholder="Selecione..."
                                />
                            </div>

                            <div>
                                <label htmlFor="city">S??tio Relecionado</label>

                                <Select
                                    options={optionsDificulty}
                                    name="city"
                                    id="city"
                                    instanceId="city"
                                    placeholder="Selecione..."
                                />
                            </div>
                    </div>

                    <div className='separ'>
                         <div className='buttonadd'>
                            <StAdd
                            onClick={addQuestButton}
                            />
                            ADICIONAR QUEST??O
                        </div>

                            <div>
                                <StButton onClick={ refreshPage }>
                                CANCELAR
                                </StButton>
                            </div>
                            <div>
                                <StButton onClick={ refreshPageafterSave }>
                                SALVAR
                                </StButton>
                            </div>
                    </div>




                        </FormGroup>

                </fieldset>
            </StFormQuiz>


            <Loading isVisible={isLoading} />
            </PaperCadastrarQuiz>

            <Paper >

            <StFormQuiz ref={formRef} onSubmit={handleFormSubmit}>

                <fieldset>
                <h3>Quest??es</h3>

                    <FormGroup mult={true}>

                        <FormInputContainer gridColumn="1 / 4">

                        <label className='vtt'>Informe qual ser?? a Pergunta</label>
                        <Input name="complement" id="complement" value="Qual ano de inagura????o do Museu Nacional ? " />

                            <div className='flex-container'>
                                <input type="radio" className='sell' value="Vdd" name="gender" />
                                <div  className='sepi'>
                                < FormInputContainerQuiz gridColumn="  1/ 4">
                                <InputQuiz name="complement" id="complement"  value="2000"/>
                                </ FormInputContainerQuiz>
                                </div>
                            </div>

                            <div className='flex-container'>
                                <input type="radio" className='sell' value="Vdd" name="gender" />
                                <div  className='sepi'>
                                < FormInputContainerQuiz gridColumn="  1/ 4">
                                <InputQuiz name="complement" id="complement" value="2006" />
                                </ FormInputContainerQuiz>
                                </div>
                            </div>

                            <div className='flex-container'>
                                <input type="radio" className='sell' value="Vdd" name="gender" />
                                <div  className='sepi'>
                                < FormInputContainerQuiz gridColumn="  1/ 4">
                                <InputQuiz name="complement" id="complement" value="1995" />
                                </ FormInputContainerQuiz>
                                </div>
                            </div>

                            <div className='flex-container'>
                                <input type="radio" className='sell' value="Vdd" name="gender" />
                                <div  className='sepi'>
                                < FormInputContainerQuiz gridColumn="  1/ 4">
                                <InputQuiz name="complement" id="complement"  value="2009"/>
                                </ FormInputContainerQuiz>
                                </div>
                            </div>
                        </FormInputContainer>
                    </FormGroup>
                </fieldset>
            </StFormQuiz>

            <Loading isVisible={isLoading} />
            </Paper>

            <Paper >

            <StFormQuiz ref={formRef} onSubmit={handleFormSubmit}>

                <fieldset>
                <h3>Quest??es</h3>

                    <FormGroup mult={true}>

                        <FormInputContainer gridColumn="1 / 4">

                        <label className='vtt'>Informe qual ser?? a Pergunta</label>
                        <Input name="complement" id="complement"  value="Qual nome do arquiteto respons??vel pela Obra ?"/>

                            <div className='flex-container'>
                                <input type="radio" className='sell' value="Vdd" name="gender"  checked/>
                                <div  className='sepi'>
                                < FormInputContainerQuiz gridColumn="  1/ 4">
                                <InputQuiz name="complement" id="complement"  value="Roberto Burle Marx"/>
                                </ FormInputContainerQuiz>
                                </div>
                            </div>

                            <div className='flex-container'>
                                <input type="radio" className='sell' value="Vdd" name="gender" />
                                <div  className='sepi'>
                                < FormInputContainerQuiz gridColumn="  1/ 4">
                                <InputQuiz name="complement" id="complement"  value="L??cio Costa"/>
                                </ FormInputContainerQuiz>
                                </div>
                            </div>

                            <div className='flex-container'>
                                <input type="radio" className='sell' value="Vdd" name="gender" />
                                <div  className='sepi'>
                                < FormInputContainerQuiz gridColumn="  1/ 4">
                                <InputQuiz name="complement" id="complement"  value=" Oscar Niemeyer "/>
                                </ FormInputContainerQuiz>
                                </div>
                            </div>

                            <div className='flex-container'>
                                <input type="radio" className='sell' value="Vdd" name="gender" />
                                <div  className='sepi'>
                                < FormInputContainerQuiz gridColumn="  1/ 4">
                                <InputQuiz name="complement" id="complement" value="Rosa Grena Kliass"/>
                                </ FormInputContainerQuiz>
                                </div>
                            </div>
                        </FormInputContainer>
                    </FormGroup>
                </fieldset>
            </StFormQuiz>

            <Loading isVisible={isLoading} />
            </Paper>

            <Paper >

            <StFormQuiz ref={formRef} onSubmit={handleFormSubmit}>

                <fieldset>
                <h3>Quest??es</h3>

                    <FormGroup mult={true}>

                        <FormInputContainer gridColumn="1 / 4">

                        <label className='vtt'>Informe qual ser?? a Pergunta</label>
                        <Input name="complement" id="complement"  value="Qual nome dado ao conjunto de Obras ao seu redor ?"/>

                            <div className='flex-container'>
                                <input type="radio" className='sell' value="Vdd" name="gender"  checked/>
                                <div  className='sepi'>
                                < FormInputContainerQuiz gridColumn="  1/ 4">
                                <InputQuiz name="complement" id="complement" value="Complexo Cultural da Rep??blica Jo??o Herculino" />
                                </ FormInputContainerQuiz>
                                </div>
                            </div>

                            <div className='flex-container'>
                                <input type="radio" className='sell' value="Vdd" name="gender" />
                                <div  className='sepi'>
                                < FormInputContainerQuiz gridColumn="  1/ 4">
                                <InputQuiz name="complement" id="complement" value="Centro cultural de Bras??lia"/>
                                </ FormInputContainerQuiz>
                                </div>
                            </div>

                            <div className='flex-container'>
                                <input type="radio" className='sell' value="Vdd" name="gender" />
                                <div  className='sepi'>
                                < FormInputContainerQuiz gridColumn="  1/ 4">
                                <InputQuiz name="complement" id="complement" value="Complexo cultural de Bras??lia"/>
                                </ FormInputContainerQuiz>
                                </div>
                            </div>

                            <div className='flex-container'>
                                <input type="radio" className='sell' value="Vdd" name="gender" />
                                <div  className='sepi'>
                                < FormInputContainerQuiz gridColumn="  1/ 4">
                                <InputQuiz name="complement" id="complement" value="Espa??o da cultura nacional"/>
                                </ FormInputContainerQuiz>
                                </div>
                            </div>
                        </FormInputContainer>
                    </FormGroup>
                </fieldset>
            </StFormQuiz>

            <Loading isVisible={isLoading} />
            </Paper>

            <Paper >

            <StFormQuiz ref={formRef} onSubmit={handleFormSubmit}>

                <fieldset>
                <h3>Quest??es</h3>

                    <FormGroup mult={true}>

                        <FormInputContainer gridColumn="1 / 4">

                        <label className='vtt'>Informe qual ser?? a Pergunta</label>
                        <Input name="complement" id="complement" />

                            <div className='flex-container'>
                                <input type="radio" className='sell' value="Vdd" name="gender" />
                                <div  className='sepi'>
                                < FormInputContainerQuiz gridColumn="  1/ 4">
                                <InputQuiz name="complement" id="complement" />
                                </ FormInputContainerQuiz>
                                </div>
                            </div>

                            <div className='flex-container'>
                                <input type="radio" className='sell' value="Vdd" name="gender"  checked/>
                                <div  className='sepi'>
                                < FormInputContainerQuiz gridColumn="  1/ 4">
                                <InputQuiz name="complement" id="complement" />
                                </ FormInputContainerQuiz>
                                </div>
                            </div>

                            <div className='flex-container'>
                                <input type="radio" className='sell' value="Vdd" name="gender" />
                                <div  className='sepi'>
                                < FormInputContainerQuiz gridColumn="  1/ 4">
                                <InputQuiz name="complement" id="complement" />
                                </ FormInputContainerQuiz>
                                </div>
                            </div>

                            <div className='flex-container'>
                                <input type="radio" className='sell' value="Vdd" name="gender" />
                                <div  className='sepi'>
                                < FormInputContainerQuiz gridColumn="  1/ 4">
                                <InputQuiz name="complement" id="complement" />
                                </ FormInputContainerQuiz>
                                </div>
                            </div>
                        </FormInputContainer>
                    </FormGroup>
                </fieldset>
            </StFormQuiz>

            <Loading isVisible={isLoading} />
            </Paper>

            <Paper >

            <StFormQuiz ref={formRef} onSubmit={handleFormSubmit}>

                <fieldset>
                <h3>Quest??es</h3>

                    <FormGroup mult={true}>

                        <FormInputContainer gridColumn="1 / 4">

                        <label className='vtt'>Informe qual ser?? a Pergunta</label>
                        <Input name="complement" id="complement" />

                            <div className='flex-container'>
                                <input type="radio" className='sell' value="Vdd" name="gender" />
                                <div  className='sepi'>
                                < FormInputContainerQuiz gridColumn="  1/ 4">
                                <InputQuiz name="complement" id="complement" />
                                </ FormInputContainerQuiz>
                                </div>
                            </div>

                            <div className='flex-container'>
                                <input type="radio" className='sell' value="Vdd" name="gender" checked/>
                                <div  className='sepi'>
                                < FormInputContainerQuiz gridColumn="  1/ 4">
                                <InputQuiz name="complement" id="complement" />
                                </ FormInputContainerQuiz>
                                </div>
                            </div>

                            <div className='flex-container'>
                                <input type="radio" className='sell' value="Vdd" name="gender" />
                                <div  className='sepi'>
                                < FormInputContainerQuiz gridColumn="  1/ 4">
                                <InputQuiz name="complement" id="complement" />
                                </ FormInputContainerQuiz>
                                </div>
                            </div>

                            <div className='flex-container'>
                                <input type="radio" className='sell' value="Vdd" name="gender" />
                                <div  className='sepi'>
                                < FormInputContainerQuiz gridColumn="  1/ 4">
                                <InputQuiz name="complement" id="complement" />
                                </ FormInputContainerQuiz>
                                </div>
                            </div>
                        </FormInputContainer>
                    </FormGroup>
                </fieldset>
            </StFormQuiz>

            <Loading isVisible={isLoading} />
            </Paper>

            </>

            ))}

            {quest.map(quize => (

                <Paper ref={divRef}>

                <StFormQuiz ref={formRef} onSubmit={handleFormSubmit}>

                    <fieldset>
                    <h3>Quest??es</h3>

                        <FormGroup mult={true}>

                            <FormInputContainer gridColumn="1 / 4">

                            <label className='vtt'>Informe qual ser?? a Pergunta</label>
                            <Input name="complement" id="complement" />

                                <div className='flex-container'>
                                    <input type="radio" className='sell' value="Vdd" name="gender" />
                                    <div  className='sepi'>
                                    < FormInputContainerQuiz gridColumn="  1/ 4">
                                    <InputQuiz name="complement" id="complement" />
                                    </ FormInputContainerQuiz>
                                    </div>
                                </div>

                                <div className='flex-container'>
                                    <input type="radio" className='sell' value="Vdd" name="gender" />
                                    <div  className='sepi'>
                                    < FormInputContainerQuiz gridColumn="  1/ 4">
                                    <InputQuiz name="complement" id="complement" />
                                    </ FormInputContainerQuiz>
                                    </div>
                                </div>

                                <div className='flex-container'>
                                    <input type="radio" className='sell' value="Vdd" name="gender" />
                                    <div  className='sepi'>
                                    < FormInputContainerQuiz gridColumn="  1/ 4">
                                    <InputQuiz name="complement" id="complement" />
                                    </ FormInputContainerQuiz>
                                    </div>
                                </div>

                                <div className='flex-container'>
                                    <input type="radio" className='sell' value="Vdd" name="gender" />
                                    <div  className='sepi'>
                                    < FormInputContainerQuiz gridColumn="  1/ 4">
                                    <InputQuiz name="complement" id="complement" />
                                    </ FormInputContainerQuiz>
                                    </div>
                                </div>
                            </FormInputContainer>
                        </FormGroup>
                    </fieldset>
                </StFormQuiz>


                <div  className='butolist'>
                        <div>
                        <StButton type="submit" toRight>
                        CANCELAR
                        </StButton>
                        </div>
                        <div>
                        <StButton type="submit" toRight>
                        CADASTRAR
                        </StButton>
                        </div>

                    </div>


                <Loading isVisible={isLoading} />
                </Paper>
            ))}

            { /* Apagar um campo  :)

            <div>
            <button onClick={() => setShow((s) => !s)}>toggle</button>
            <div style={{ display: show ? "block" : "none" }}>hello</div>
            </div>
           */}
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
