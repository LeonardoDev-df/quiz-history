import React,{
    useRef,
    useEffect,
    useState
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
    Copy,
    PaperCadastrarQuiz
} from '../../../../styles/pages/shared/control-panel.styles'
import { SidebarLayout } from '../../../../components/layouts/sidebar-layout'
import { AUTH_TOKEN_KEY } from '../../../../contexts/auth'
import Head from '../../../../infra/components/Head'


async function cadastrarQuiz() {
  
    const form = document.forms["create_quiz"];
    const categorie = form["categorie"].value;  
    const title = form["title"].value;
   
    const data = {
        categorie,
        title,
    };
  
    console.log(`data`, data);
    try {
      const result = await fetch(
        "http://localhost:3333/categorie/create",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );
   
      if (result.ok) { 
        alert("Quiz cadastrado com sucesso.");

      } else {
        alert("Quiz já existe.");
      }
    } catch (error) {
      alert("Erro ao cadastrar Quiz");
      
    }
  
  }

  // NOTIFICAÇÃO
async function criarNotificacao( id: any,   ) {
    const form = document.forms["create_quiz"];
    const categoria = form["categoria"].value;  
    const NomeTitulo = form["title"].value;
    const data = {
      titulo: NomeTitulo,
      NomeCategoria: categoria,
      id_titulo: id,
    };
  
    console.log(`data`, data);
  
    try {
      const result = await fetch(`http://localhost:3000/categoria/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Authorization: "token " + TOKEN,
        },
        
        body: JSON.stringify(data),
        
      });
      
      if (result.status === 201) {
        console.log(`Notificação criada com suesso.`);
       
      } else if (result.status === 401) {
        console.log("Ocorreu um erro: Não autorizado.");
      }
    } catch (error) {
     
    } 
  }


function Upload() {
    const [isLoading, setIsLoading] = useState(false)
    const [files, setFiles] = useState<FileList>()
    const [ quizes, setQuizes] = useState([])
    const [search, setSearch] = React.useState("")
    const divRef = useRef<HTMLDivElement>(null)
    const formRef = useRef<FormHandles>(null)
    const [open, setOpen] = useState(false)

    const searchLowerCase = search.toLocaleLowerCase()
    const [selectValue, setSelectValue] = useState(1);
    const [users, setUsers] = useState([]);

    const getUsers = async () => {
        try {
            const response = await axios.get(
                "http://localhost:3000/categorias/list"  
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
    
    const list = [
        {id: 1, name: 'Sítio Cultural'},
        {id: 2, name: 'Monumento'},
        {id: 3, name: 'Museu'},
        {id: 4, name: 'Outros'},
      ];
    
    
    const result = users.filter((user) => user.NomeCategoria.toLowerCase().includes(searchLowerCase))
    return (
        
           

        <ContainerQuiz>
        <Head title="Upload 3D | RV History" />

        <PaperCadastrarQuiz ref={divRef}>
                <h2>Cadastrar Quiz</h2>
                <fieldset>
                    <h3></h3>
                    <form id="create_quiz">
                        <div className='arrumando'>
                            
                            <div >
                            <label>Selecione a Categoria</label>
                            <select className='selec' name="categorie"
                                id="categorie" value={selectValue} onChange={e => setSelectValue(e.target.value)}>
                                {list.map((user, index) => (
                                <option className='opt'
                                id="categorie"   value={user.name}>{user.name}</option>
                                ))}        
                            </select>
                                
                            </div>
                            <div>                          
                                <label>Título do Quiz</label>
                                <input
                                className="setting"     
                                name="title"
                                id="title"
                                type="text"
                                required
                                />   
                            </div>
                        </div>
                    </form>
                </fieldset>


                    <button className="buttau"  onClick={cadastrarQuiz}>
                        CADASTRAR
                    </button>

                            
            </PaperCadastrarQuiz>

            <Copy>&copy; 2023 QuizHistory. All right reserved.</Copy>
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
