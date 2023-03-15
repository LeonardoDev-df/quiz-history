import React, {
    useEffect,
    useState
} from 'react'
import { Flex } from './Flex';
import { Box } from './Box';
import axios from 'axios'
import {
    Container,
    PaperQuiz,
    Copy,
    StForm
} from '../../../../styles/pages/shared/control-panel.styles'
import { SidebarLayout } from '../../../../components/layouts/sidebar-layout-quiz'
import { Loading } from '../../../../components/Loading'
import EmblemOuro  from "../../../../assets/illustrations/ouro.svg"



const Upload = () => {
    const Ouro = EmblemOuro
    const [isLoading, setIsLoading] = useState(false)
    const [info, setInfo] = useState({})
    const [text, setText] = useState('')
    const [search, setSearch] = React.useState("")
    const [show, setShow] = useState(true);
    console.log(search)

    const searchLowerCase = search.toLocaleLowerCase()

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

    const addQuizEditButton = (e) => {
       
        setSearch(e.target.value)

        setShow((s) => !s)
      };


    useEffect(() =>{
        getUsers();
    }, []);


    const result = users.filter((user) => user.apelido.toLowerCase().includes(searchLowerCase))
    return (
        <Container>
        
            <PaperQuiz >

            <StForm >
            <h1>Seja Bem-Vindo ao </h1>
            <h1>Ranking</h1>

            <div className='group'>
                <div className='arrum'>
                    
                    <div >
                        <input 
                            className='arru'
                            type="search"
                            value={search}
                            onChange={addQuizEditButton}
                            placeholder="Digite seu Apelido"
                            name="q"
                            required
                            pattern="[A-z]{2}[0-9]{4}" 
                        />
                    </div>
                </div>
                
           
                        
                       
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
                            {result
                            .sort( (a: any, b: any) => a.pontos > b.pontos ? - 10 : 10 )
                            .map((user) => (
                            <>
                            <div >
                                <div className='ponto' key={user.apelido}>
                                    <div>{user.apelido} </div>
                                    <div className='pont'>{user.pontos} </div>
                                </div>                             
                            </div>
                            <div className='displa'style={{ display: show ? "none" : "flex" }}>
                                <div className='emblema'>
                                    <img  className='emblemas' src={user.emblema}   />
                                </div>

                            </div>
                            
                            </>    
                        ))} 
                           
                        </div>
                    </div>
                </Box>

            </Flex>

            </div>


            </StForm>
            <Loading isVisible={isLoading} />
            </PaperQuiz>


            <Copy>&copy; 2023 QuizHistory. All right reserved.</Copy>
        </Container>
    )
}

Upload.Layout = SidebarLayout

export default Upload
