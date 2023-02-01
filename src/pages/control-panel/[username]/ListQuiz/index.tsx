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
        { value: 'Sítio', label: 'Sítio Cultural' },
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

      const AlertQuizEditButton = (e) => {
        e.preventDefault()
        confirm("Tem certeza que deseja EXCLUIR este quiz ?");
      };



      { /* Apagar um campo */ }
       const [show, setShow] = useState(true);

       function refreshPage(){
        alert("Edição de Dados foi cancelada com sucesso!")
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
                                <label htmlFor="uf">Título</label>
                                <Input name="complement" id="complement" value=' Museu Nacional' />
                        </div>

                        <div className='pe'>
                                <label htmlFor="uf">Categoria</label>
                                <Input name="complement" id="complement" value='Museu'/>
                        </div>

                        <div className='pes'>
                                <label htmlFor="uf">Sítio Relacionado</label>
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
                                        onClick={AlertQuizEditButton}
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
                                <label htmlFor="province">Título</label>
                                <Input name="province" id="province" value='Museu Nacional' />
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
                                <label htmlFor="city">Sítio Relecionado</label>

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
                            ADICIONAR QUESTÃO
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
                <h3>Questões</h3>

                    <FormGroup mult={true}>

                        <FormInputContainer gridColumn="1 / 4">

                        <label className='vtt'>Informe qual será a Pergunta</label>
                        <Input name="complement" id="complement" value="Qual ano de inauguração do Museu Nacional ? " />

                            <div className='flex-container'>
                                <input type="radio" className='sell' value="Vdd" name="gender" />
                                <div  className='sepi'>
                                < FormInputContainerQuiz gridColumn="  1/ 4">
                                <InputQuiz name="complement" id="complement"  value="2000"/>
                                </ FormInputContainerQuiz>
                                </div>
                            </div>

                            <div className='flex-container'>
                                <input type="radio" className='sell' value="Vdd" name="gender" checked/>
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
                <h3>Questões</h3>

                    <FormGroup mult={true}>

                        <FormInputContainer gridColumn="1 / 4">

                        <label className='vtt'>Informe qual será a Pergunta</label>
                        <Input name="complement" id="complement"  value="Qual o nome do arquiteto responsável pela Obra ?"/>

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
                                <InputQuiz name="complement" id="complement"  value="Lúcio Costa"/>
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
                <h3>Questões</h3>

                    <FormGroup mult={true}>

                        <FormInputContainer gridColumn="1 / 4">

                        <label className='vtt'>Informe qual será a Pergunta</label>
                        <Input name="complement" id="complement"  value="Qual nome dado ao conjunto de Obras ao seu redor ?"/>

                            <div className='flex-container'>
                                <input type="radio" className='sell' value="Vdd" name="gender"  checked/>
                                <div  className='sepi'>
                                < FormInputContainerQuiz gridColumn="  1/ 4">
                                <InputQuiz name="complement" id="complement" value="Complexo Cultural da República João Herculino" />
                                </ FormInputContainerQuiz>
                                </div>
                            </div>

                            <div className='flex-container'>
                                <input type="radio" className='sell' value="Vdd" name="gender" />
                                <div  className='sepi'>
                                < FormInputContainerQuiz gridColumn="  1/ 4">
                                <InputQuiz name="complement" id="complement" value="Centro cultural de Brasília"/>
                                </ FormInputContainerQuiz>
                                </div>
                            </div>

                            <div className='flex-container'>
                                <input type="radio" className='sell' value="Vdd" name="gender" />
                                <div  className='sepi'>
                                < FormInputContainerQuiz gridColumn="  1/ 4">
                                <InputQuiz name="complement" id="complement" value="Complexo cultural de Brasília"/>
                                </ FormInputContainerQuiz>
                                </div>
                            </div>

                            <div className='flex-container'>
                                <input type="radio" className='sell' value="Vdd" name="gender" />
                                <div  className='sepi'>
                                < FormInputContainerQuiz gridColumn="  1/ 4">
                                <InputQuiz name="complement" id="complement" value="Espaço da cultura nacional"/>
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
                <h3>Questões</h3>

                    <FormGroup mult={true}>

                        <FormInputContainer gridColumn="1 / 4">

                        <label className='vtt'>Informe qual será a Pergunta</label>
                        <Input name="complement" id="complement" value="Quais horários de visitação?"/>

                            <div className='flex-container'>
                                <input type="radio" className='sell' value="Vdd" name="gender" />
                                <div  className='sepi'>
                                < FormInputContainerQuiz gridColumn="  1/ 4">
                                <InputQuiz name="complement" id="complement" value="Horário de visitação: sextas, sábados e domingos das 08h às 12h."/>
                                </ FormInputContainerQuiz>
                                </div>
                            </div>

                            <div className='flex-container'>
                                <input type="radio" className='sell' value="Vdd" name="gender"  checked/>
                                <div  className='sepi'>
                                < FormInputContainerQuiz gridColumn="  1/ 4">
                                <InputQuiz name="complement" id="complement" value="Horário de visitação: sextas, sábados e domingos das 06h às 10h."/>
                                </ FormInputContainerQuiz>
                                </div>
                            </div>

                            <div className='flex-container'>
                                <input type="radio" className='sell' value="Vdd" name="gender" />
                                <div  className='sepi'>
                                < FormInputContainerQuiz gridColumn="  1/ 4">
                                <InputQuiz name="complement" id="complement" value="Horário de visitação: sextas, sábados e domingos das 10h às 16h." checked/>
                                </ FormInputContainerQuiz>
                                </div>
                            </div>

                            <div className='flex-container'>
                                <input type="radio" className='sell' value="Vdd" name="gender" />
                                <div  className='sepi'>
                                < FormInputContainerQuiz gridColumn="  1/ 4">
                                <InputQuiz name="complement" id="complement" value="Horário de visitação: sextas, sábados e domingos das 13h às 19h"/>
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
                <h3>Questões</h3>

                    <FormGroup mult={true}>

                        <FormInputContainer gridColumn="1 / 4">

                        <label className='vtt'>Informe qual será a Pergunta</label>
                        <Input name="complement" id="complement" value="O que é o Museu Nacional da República?"/>

                            <div className='flex-container'>
                                <input type="radio" className='sell' value="Vdd" name="gender" />
                                <div  className='sepi'>
                                < FormInputContainerQuiz gridColumn="  1/ 4">
                                <InputQuiz name="complement" id="complement" value="É um espaço que insere Brasília no circuito internacional das artes e mostra o que há de melhor na arte brasileira." checked/>
                                </ FormInputContainerQuiz>
                                </div>
                            </div>

                            <div className='flex-container'>
                                <input type="radio" className='sell' value="Vdd" name="gender"  checked/>
                                <div  className='sepi'>
                                < FormInputContainerQuiz gridColumn="  1/ 4">
                                <InputQuiz name="complement" id="complement" value="O Museu Nacional da República é integrante do Conjunto Cultural da República."/>
                                </ FormInputContainerQuiz>
                                </div>
                            </div>

                            <div className='flex-container'>
                                <input type="radio" className='sell' value="Vdd" name="gender" />
                                <div  className='sepi'>
                                < FormInputContainerQuiz gridColumn="  1/ 4">
                                <InputQuiz name="complement" id="complement" value="Obra de Oscar Niemeyer, o Museu começou a ser construído em 1999."/>
                                </ FormInputContainerQuiz>
                                </div>
                            </div>

                            <div className='flex-container'>
                                <input type="radio" className='sell' value="Vdd" name="gender" />
                                <div  className='sepi'>
                                < FormInputContainerQuiz gridColumn="  1/ 4">
                                <InputQuiz name="complement" id="complement" value="Foi idealizado para fazer parte do Setor Cultural Sul da Nova Capital."/>
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
                <h3>Questões</h3>

                    <FormGroup mult={true}>

                        <FormInputContainer gridColumn="1 / 4">

                        <label className='vtt'>Informe qual será a Pergunta</label>
                        <Input name="complement" id="complement" value="Qual a missão do Museu Nacional da República?"/>

                            <div className='flex-container'>
                                <input type="radio" className='sell' value="Vdd" name="gender" />
                                <div  className='sepi'>
                                < FormInputContainerQuiz gridColumn="  1/ 4">
                                <InputQuiz name="complement" id="complement" value="Elevar e revelar ao maior número de pessoas possível, a cultura visual contemporânea." checked/>
                                </ FormInputContainerQuiz>
                                </div>
                            </div>

                            <div className='flex-container'>
                                <input type="radio" className='sell' value="Vdd" name="gender"  checked/>
                                <div  className='sepi'>
                                < FormInputContainerQuiz gridColumn="  1/ 4">
                                <InputQuiz name="complement" id="complement" value="Organizar as informações do mundo todo e torná-las acessíveis e úteis em caráter universal."/>
                                </ FormInputContainerQuiz>
                                </div>
                            </div>

                            <div className='flex-container'>
                                <input type="radio" className='sell' value="Vdd" name="gender" />
                                <div  className='sepi'>
                                < FormInputContainerQuiz gridColumn="  1/ 4">
                                <InputQuiz name="complement" id="complement" value="Levar inspiração e inovação para os atletas de todo o mundo."/>
                                </ FormInputContainerQuiz>
                                </div>
                            </div>

                            <div className='flex-container'>
                                <input type="radio" className='sell' value="Vdd" name="gender" />
                                <div  className='sepi'>
                                < FormInputContainerQuiz gridColumn="  1/ 4">
                                <InputQuiz name="complement" id="complement" value="Levar alegria para todas as pessoas do mundo."/>
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
                <h3>Questões</h3>

                    <FormGroup mult={true}>

                        <FormInputContainer gridColumn="1 / 4">

                        <label className='vtt'>Informe qual será a Pergunta</label>
                        <Input name="complement" id="complement" value="Qual endereço, do Museu Nacional da República?"/>

                            <div className='flex-container'>
                                <input type="radio" className='sell' value="Vdd" name="gender" />
                                <div  className='sepi'>
                                < FormInputContainerQuiz gridColumn="  1/ 4">
                                <InputQuiz name="complement" id="complement" value="Endereço: Setor Cultural Sul, lote 2, próximo à Rodoviária do Plano Piloto – Zona 0." checked/>
                                </ FormInputContainerQuiz>
                                </div>
                            </div>

                            <div className='flex-container'>
                                <input type="radio" className='sell' value="Vdd" name="gender"  checked/>
                                <div  className='sepi'>
                                < FormInputContainerQuiz gridColumn="  1/ 4">
                                <InputQuiz name="complement" id="complement" value="Endereço: Zona cívico Administrativa, Esplanada dos Ministérios – Lote 12."/>
                                </ FormInputContainerQuiz>
                                </div>
                            </div>

                            <div className='flex-container'>
                                <input type="radio" className='sell' value="Vdd" name="gender" />
                                <div  className='sepi'>
                                < FormInputContainerQuiz gridColumn="  1/ 4">
                                <InputQuiz name="complement" id="complement" value="Endereço: Eixo Monumental - Lado Oeste - Praça do Cruzeiro."/>
                                </ FormInputContainerQuiz>
                                </div>
                            </div>

                            <div className='flex-container'>
                                <input type="radio" className='sell' value="Vdd" name="gender" />
                                <div  className='sepi'>
                                < FormInputContainerQuiz gridColumn="  1/ 4">
                                <InputQuiz name="complement" id="complement" value="Endereço: Feira de Artesanato da Torre de TV SDC - Eixo Monumental."/>
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
                <h3>Questões</h3>

                    <FormGroup mult={true}>

                        <FormInputContainer gridColumn="1 / 4">

                        <label className='vtt'>Informe qual será a Pergunta</label>
                        <Input name="complement" id="complement" value="O auditório maior do museu possui quantos lugares para o público?"/>

                            <div className='flex-container'>
                                <input type="radio" className='sell' value="Vdd" name="gender" />
                                <div  className='sepi'>
                                < FormInputContainerQuiz gridColumn="  1/ 4">
                                <InputQuiz name="complement" id="complement" value="500 lugares"/>
                                </ FormInputContainerQuiz>
                                </div>
                            </div>

                            <div className='flex-container'>
                                <input type="radio" className='sell' value="Vdd" name="gender" />
                                <div  className='sepi'>
                                < FormInputContainerQuiz gridColumn="  1/ 4">
                                <InputQuiz name="complement" id="complement" value="450 lugares"/>
                                </ FormInputContainerQuiz>
                                </div>
                            </div>

                            <div className='flex-container'>
                                <input type="radio" className='sell' value="Vdd" name="gender" />
                                <div  className='sepi'>
                                < FormInputContainerQuiz gridColumn="  1/ 4">
                                <InputQuiz name="complement" id="complement" value="390 lugares"/>
                                </ FormInputContainerQuiz>
                                </div>
                            </div>

                            <div className='flex-container'>
                                <input type="radio" className='sell' value="Vdd" name="gender" checked/>
                                <div  className='sepi'>
                                < FormInputContainerQuiz gridColumn="  1/ 4">
                                <InputQuiz name="complement" id="complement"  value="700 lugares" checked/>
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
                    <h3>Questões</h3>

                        <FormGroup mult={true}>

                            <FormInputContainer gridColumn="1 / 4">

                            <label className='vtt'>Informe qual será a Pergunta</label>
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
                        <StButton onClick={ refreshPage }>
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
