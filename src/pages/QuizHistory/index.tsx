import React from 'react';
import { Flex } from './Flex';
import { Box } from './Box';
import {
    useRef,
    useEffect,
    useState
} from 'react'
import {  GroupTypeBase, OptionTypeBase } from 'react-select'
import { FormHandles, SubmitHandler } from '@unform/core'

import axios from 'axios'
import Link from '../../infra/components/Link'
import {
    QuizGaming,
    Footersq,
    LogoFootersq,
    FacebookIconsq,
    InstagramIconsq,
    ArrowRightIconsq
} from '../../styles/pages/Home'

import {
    Container,
    PaperQuiz,
    Copy,
    StForm
} from '../../styles/pages/shared/control-panel.styles'
import { SidebarLayout } from '../../components/layouts/sidebar-layout-quizes'
import { Loading } from '../../components/Loading'



function Upload() {
    const [isLoading, setIsLoading] = useState(false)
    const divRef = useRef<HTMLDivElement>(null)
    const formRef = useRef<FormHandles>(null)
    const [users, setUsers] = useState([]);

    const getUsers = async () => {
        try {
            const response = await axios.get(
                "http://localhost:3333/users"  
            );
            const data = response.data

            console.log(data);
            setUsers(data);
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() =>{
        getUsers();
    }, []);
    
    return (
        <Container>


            <PaperQuiz ref={divRef}>

                <StForm ref={formRef} >
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
                    <div className='scroll'>
                        <div className='borda'>
                                <div className='ranki'>
                                    <h3 className='ranki'>RANKING GERAL</h3>
                                </div>

                                <h3 className='melhor'>Pontuação dos Melhores Colocados</h3>

                                <div className='pontua'>
                                    <div>Apelido</div> <div>Pontos</div>
                                </div>

                            
                                    {users
                                    .sort( (a: any, b: any) => a.pontos > b.pontos ? - 10 : 10 )
                                    .map((user: any) => ([
                                <>
                                
                                    <div className='ponto' key={user._id}>
                                    <div>{user.apelido} </div>
                                    <div className='pont'>{user.pontos}</div>
                                    </div>                             
                            
                            
                                </>    
                        ])
                            )}
                            
                        </div>
                    </div>
                    </Box>

                </Flex>

            </div>


                </StForm>
                <Loading isVisible={isLoading} />
            </PaperQuiz>

            <Footersq>
                <section>
                    <div>
                     
                        <p>
                        "Dê um peixe a um homem e você o alimentará por um dia; ensine um homem 
                        a pescar e você o alimentará por toda a vida." - Maimônides, filósofo  
                        </p>
                        
                    </div>
                    
                </section>

                <div>
                    <p>
                        &copy; 2023 Copyright. All right reserved. Develop with
                        ❤️ by <span>Leonardo Lopes</span>.
                    </p>
                </div>
            </Footersq>
        </Container>
    )
}

Upload.Layout = SidebarLayout

export default Upload





