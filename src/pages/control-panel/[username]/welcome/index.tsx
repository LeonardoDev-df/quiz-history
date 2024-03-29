import React, {
    useContext,
    useRef,
    useEffect,
    useState,
    useMemo,
    useCallback,
    FocusEvent
} from 'react'
import { Flex } from './Flex';
import Image from 'next/image'
import { Box } from './Box';
import { FormHandles, SubmitHandler } from '@unform/core'
import { ThemeContext } from 'styled-components'
import { GetServerSideProps } from 'next'
import { parseCookies } from 'nookies'
import * as Yup from 'yup'
import axios from 'axios'
import {
    Container,
    Paper,
    PaperQuiz,
    FormGroup,
    StButton,
    Copy,
    StForm,
    FormInputContainer
} from '../../../../styles/pages/shared/control-panel.styles'
import { SidebarLayout } from '../../../../components/layouts/sidebar-layout-quizes'
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
import { nflTeams } from '../../../../datas'

import {

    QuizGaming,
    Header,

    Four
} from '../../../../styles/pages/Home'


function Upload({ UFOptions }) {
    const [citySelectOptions, setCitySelectOptions] = useState<OptionProps>()
    const [hasAdvancedUpload, setHasAdvancedUpload] = useState(false)
    const [isFileError, setIsFileError] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [files, setFiles] = useState<FileList>()


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
   
    const [info, setInfo] = useState({})
    const [text, setText] = useState('')
    const [search, setSearch] = React.useState("")
    console.log(search)

    const searchLowerCase = search.toLocaleLowerCase()

    useEffect (() => {
        if (text) {
            fetch(`'../../../../data'`)
            .then((response) => response.json())
            .then((response) => {
                setInfo(response)
                console.log(response)
            })
        }
    }, [text])


    const teams = nflTeams.filter((team) => team.name.toLowerCase().includes(searchLowerCase))
    
    return (
        <Container>


            <PaperQuiz >

            <StForm >
            <h1>Seja Bem-Vindo ao </h1>
            <h1>Quiz History</h1>

            <div className='group'>
            <Flex
                    padding={5}
                    bgColor=""
                    height="370px"
                    container
                    justifyContent="space-around"
                    alignItems="flex-start"
                    >

                    <Box width="370px"
                        height="300px"
                        display="flex"
                    >

                        <div className='bordi'>
                        <QuizGaming />



                        </div>
                    </Box>

                </Flex>
                
           
                        
                       
            <Flex
                padding={5}
                bgColor=""
                height="370px"
                width="470px"
                container
                justifyContent="space-around"
                alignItems="flex-start"
                >
               
                <Box width="370px"
                    height="300px"
                    display="flex"
                >

                    <div className='borda'>
                            <div className='rank'>
                                <h3 className='rank'>RANKING GERAL</h3>
                            </div>

                            <h3 className='melhor'>Pontuação dos Melhores Colocados</h3>

                            <div className='pontua'>
                                <div>Apelido</div> <div>Pontos</div>
                            </div>
                        {teams.map((team) => (
                            <>
                            <div>
                                <div className='ponto' key={team.name}>
                                    <div>{team.name} </div>
                                    <div>{team.pontos} </div>
                                </div>                             
                            </div>
                            <div style={{width: '25%', height: '60%',
                                         marginLeft: "-40%", position: 'absolute'
                                         ,marginTop: "-15%",}}>
                                <img  src={team.div}   />
                            </div>
                            </>    
                        ))} 
                    
                    </div>
                </Box>

            </Flex>

            </div>


            </StForm>
               
            </PaperQuiz>

            <Copy>&copy; 2023 QuizHistory. All right reserved.</Copy>
        </Container>
    )
}

Upload.Layout = SidebarLayout

export default Upload




