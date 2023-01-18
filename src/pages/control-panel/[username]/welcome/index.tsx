import React, {
    useContext,
    useRef,
    useEffect,
    useState,
    useMemo
} from 'react'
import { Flex } from './Flex';
import Image from 'next/image'
import { Box } from './Box';
import {
    Container,
    PaperQuiz,
    EmblemSilver,
    Copy,
    StForm
} from '../../../../styles/pages/shared/control-panel.styles'
import { SidebarLayout } from '../../../../components/layouts/sidebar-layout-quiz'
import { Loading } from '../../../../components/Loading'
import { nflTeams } from '../../../../datas'

import {

    QuizGaming,
    Header,

    Four
} from '../../../../styles/pages/Home'


function Upload({  }) {
    const [isLoading, setIsLoading] = useState(false)
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
            <h1>Ranking</h1>

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
                        <div className='ranki'>
                            <h3>RANKING GERAL</h3>
                        </div>

                        <h3 className='melhor'>Pontuação dos Colocados</h3>

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




