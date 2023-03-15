import React, {
    useContext,
    useRef,
    useEffect,
    useState
} from 'react'
import { ThemeContext } from 'styled-components'
import { GetServerSideProps } from 'next'
import { parseCookies } from 'nookies'
import axios from 'axios'
import { QuizContext } from "../../../../context/quiz";
import {
    ContainerQuiz,
    FormQuiz,
    PaperCadastrarQuiz,
    Paper,
    StAdd,
    StEdit,
    StTrashQuize,
    StFormQuiz,
    StButton,
    Copy
} from '../../../../styles/pages/shared/control-panel.styles'
import { SidebarLayout } from '../../../../components/layouts/sidebar-layout'
import { AUTH_TOKEN_KEY } from '../../../../contexts/auth'
import { useToast } from '../../../../hooks/use-toast'
import Head from '../../../../infra/components/Head'
import { Check } from '../../../../styles/Icons'
const URL = "http://localhost:3333";

let categoria: any
let title: any
let id: any
async function cadastrarQuestion() {
   

    const form = document.forms["create_question"];

    const category = "Museu"
    const titulo = "Museu do Catetinho"
    const question = form["description"].value;
    const options = [
        form["resposta1"].value,
        form["resposta2"].value,
        form["resposta3"].value,
        form["resposta4"].value
    ]
    const answer =  form["resposta1"].value
    const tip = form["tip"].value
    const questions = [
        {
            question,
            options,
            answer,
            tip
    }
    ]
    //const answer = resposta1
    //const id_respostas = 1
   

    const data = {
        category,
        titulo,
        questions
    };
   
    try {
      const result = await fetch(`http://localhost:3333/questions/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Authorization: "token " + TOKEN,
        },
        body: JSON.stringify(data),
      });
     
      if (result.status === 201) {
        alert("Questão cadastrada com sucesso.");     
      } else if (result.status === 401) {
        alert("Ocorreu um erro: Não autorizado.");
      }
    } catch (error) {
      alert("Erro ao cadastrar termo");
      console.log(`error.message`);
    }
    
  }


async function DeletandoTitulo(filteredPerson: any) {
    const categoria = await verTituloEspecifico(filteredPerson);
  
    try {
      const result = await fetch(`${URL}/categoria/${categoria.id}/delete`, {
        method: "DELETE",
      });
      const json = await result.json();
  
      alert("Titulo Deletado com Sucesso!");
  
      location.reload();
    } catch (error) {
      console.log(`Erro ao deletar Titulo`);
    }

  }


  async function verTituloEspecifico(filteredPerson: any) {
    try {
      const result = await fetch(`${URL}/questions/${filteredPerson}/list`);
      if (result.status === 200) {
        const json = await result.json();
        console.log(`Informações do termo: `, json);
        return json;
      } else if (result.status === 400) {
        console.log(`Termo não encontrado`);
      }
    } catch (error) {
      console.log(`Erro ao ver informações do termo`);
    }
  }

  

function Upload() {
    const { colors } = useContext(ThemeContext)
    const { addToast } = useToast()
    const [search, setSearch] = React.useState("")

    const divRef = useRef<HTMLDivElement>(null)
    const [categories, setCategories] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [users, setUsers] = useState([]);
    const searchLowerCase = search.toLocaleLowerCase()
    const [selectValue, setSelectValue] = useState(1);
    const [selecteValue, setSelecteValue] = useState(1);
    let [ selectId, setselectId] = useState( );
    const [ quest, setQuest] = useState([])
    const [ newquest, setNewQuest] = useState([])
    const [ QuizEdit, setQuizEdit] = useState([])
    const [ QuestionEdit, setQuestionEdit] = useState([])
    const [show, setShow] = useState(true);
    const [mostrar, setMostrar] = useState(true);
    const [amostrar, setaMostrar] = useState(true);
    const [mostrando, setMostrando] = useState(true);
    const [amostrando, setaMostrando] = useState(true);
    const [aparecer, setAparecer] = useState(true);
   


    const getCategories= async () => {
        try {
            const response = await axios.get(
                "http://localhost:3333/categorie"  
            );
            const data = response.data
           
            setCategories(data);
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() =>{
        getCategories();
    }, []);

    
 

    const getQuestions = async () => {
        try {
            const response = await axios.get(
                "http://localhost:3333/questions/list"  
            );
            const data = response.data
            JSON.stringify(data) 
            setQuestions(data);
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() =>{
        getQuestions();
    }, []);

    const list = [
        {id: 1, name: 'Sítio Cultural'},
        {id: 2, name: 'Monumento'},
        {id: 3, name: 'Museu'},
        {id: 4, name: 'Outros'},
    ];

    const lista = [
        {id: 1, name: 'Museu Nacional'}, 
        {id: 2, name: 'Museu do Catetinho'},
    ];
   
    //Abre parte de editar o quiz
      const addQuizEditButton = (e) => {
        e.preventDefault()   
        categoria = selectValue.toString()   
        if(categoria == "Museu"){
           
            alert(categoria)  
            setQuizEdit([...questions, ""]);
            setShow((s) => !s)
        }else{
            alert(categoria)  
            alert("Nenhum Quiz cadastrado nesta categoria!"); 
        }      
      };
      
       //Abre a parte de questões cadastradas
       async function addQuestionEditButton(){
        title = selecteValue.toString()   
        alert("Aqui agora!!!"); 
        console.log(title)
       if(title == "Museu Nacional"){
            setQuestionEdit([...questions, ""]);
           
            setMostrar((s) => !s)
            setaMostrar((s) => !s)
            setShow((s) => !s)
            setaMostrando((s) => !s)
            id = questions[0]._id
       }
       
        if(title == "Museu do Catetinho"){
            setMostrando((s) => !s)
            setaMostrando((s) => !s)
            setaMostrar((s) => !s)
           
            
            setShow((s) => !s)
            id = questions[0]._id
       }

       
            
    
      };

     
     // console.log(questions[0]._id)
      const addQuestButton = (e) => {
        e.preventDefault()

        setQuest([...quest, ""]);
      };

    

   
      const cancelar = (e) => {
        e.preventDefault()
        alert("Edição cancelada com sucesso!")
        window.location.reload();
      }

      
  
    return (
        <ContainerQuiz>
            <Head title="Upload 3D | RV History" />

            { /* Página home quizzes */ }
            <PaperCadastrarQuiz ref={divRef} >
            <h2>Quizzes</h2>
            <section style={{ display: amostrar ? "block" : "none" }}>
                <fieldset>
                    <h3></h3>
                    <form id="create_user" >
                        <div className='arruma'>
                            
                            <div >
                            <label className='selecat'>Selecione a Categoria</label>
                            <select className='selec' name="categoria"
                                id="categoria" value={selectValue} onChange={e => setSelectValue(e.target.value)}>
                                {list.map((user, index) => (
                                <option className='opt'
                                id="categoria" value={user.name}>{user.name}</option>
                                ))}        
                            </select>
                                
                            </div>
                           
                        </div>
                    </form>
                </fieldset>


                    <button className="buttau"   onClick={addQuizEditButton}>
                        PESQUISAR
                    </button>
            </section>
            </PaperCadastrarQuiz>

           
            { /* Página quizzes depois de clicar pesquisar */ }
            {categories.filter(category => category.categorie == "Museu" ).map(filteredPerson =>(
                
                <>
                   
                    <PaperCadastrarQuiz ref={divRef} style={{ display: show ? "none": "block" }}>

                    <StFormQuiz >

                        <fieldset >
                        
                        <FormQuiz mult={true}>

                            <div>
                            <div className='pe'>
                                    <label>Título</label>
                                    <label className='orga'>{`${filteredPerson.title}`}</label>
                            </div>

                            <div className='pe'>
                                    <label htmlFor="uf">Categoria</label>
                                    <label className='orga'>{`${filteredPerson.categorie}`}</label>
                            </div>

                            <div className='pes' >
                                    <label htmlFor="uf">Sítio Relacionado</label>
                                    <select className='selecion' name="categoria"
                                        id="categoria" value={selecteValue} onChange={e => setSelecteValue(e.target.value)}>
                                        {lista.map((user, index) => (
                                        <option className='opt'
                                        id="categoria" value={user.name}>{`${filteredPerson.title}`}</option>
                                        ))}        
                                    </select>
                            </div>
                            </div>


                        <div className='organiz'>
                                <div className='listedi'>
                                        <div className='buttonadd'>
                                            <StEdit
                                            onClick={() => addQuestionEditButton()}
                                            />
                                        </div>
                                        <div >
                                            <label className='buttonaddicty' htmlFor="city">EDITAR QUIZ&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label>
                                        </div>
                                </div>
                                <div className='listedi'>
                                        <div className='buttonadd'>
                                            <StTrashQuize                                          
                                            //value={ah = parseInt(filteredPerson.id)}
                                            onClick={() => DeletandoTitulo(filteredPerson.id)}
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

                    </PaperCadastrarQuiz>
                </>            
            ))}
            
                        { /* Página editarquizzes depois de clicar editar quiz /parte da categoria */ }
                        {categories.filter(category => category.title == "Museu Nacional").map(filteredPerson =>(
                            
                            <>
                            
                                <PaperCadastrarQuiz ref={divRef} style={{ display: mostrar ? "none": "block" }}>

                                <StFormQuiz >

                                    <fieldset >
                                    
                                    <FormQuiz mult={true}>

                                        <div>
                                        <div className='pe'>
                                                <label>Título</label>
                                                <label className='orga'>{`${filteredPerson.title}`}</label>
                                        </div>

                                        <div className='pe'>
                                                <label htmlFor="uf">Categoria</label>
                                                <label className='orga'>{`${filteredPerson.categorie}`}</label>
                                        </div>

                                        <div className='pes' >
                                                <label htmlFor="uf">Sítio Relacionado</label>
                                                <select className='selecion' name="categoria"
                                                    id="categoria" value={selecteValue} onChange={e => setSelecteValue(e.target.value)}>
                                                    {lista.map((user, index) => (
                                                    <option className='opt'
                                                    id="categoria" value={user.name}>{`${filteredPerson.title}`}</option>
                                                    ))}        
                                                </select>
                                        </div>
                                        </div>


                                    <div className='separ' >
                                    <div className='buttonadd'>
                                        <StAdd
                                        onClick={addQuestButton}
                                        />
                                        ADICIONAR QUESTÃO
                                    </div>

                                        <div>
                                            <StButton 
                                            onClick={addQuestionEditButton}>
                                            CANCELAR
                                            </StButton>
                                        </div>
                                        <div>
                                            <StButton >
                                            SALVAR
                                            </StButton>
                                        </div>
                                </div>

                                    </FormQuiz>

                                    </fieldset>
                                </StFormQuiz>

                                </PaperCadastrarQuiz>
                            </>            
                        ))}

                        { /* Página editarquizzes depois de clicar editar quiz /parte da categoria */ }
                        {categories.filter(category => category.title == "Museu do Catetinho").map(filteredPerson =>(
                            
                            <>
                            
                                <PaperCadastrarQuiz ref={divRef} style={{ display: mostrando ? "none": "block" }}>

                                <StFormQuiz >

                                    <fieldset >
                                    
                                    <FormQuiz mult={true}>

                                        <div>
                                        <div className='pe'>
                                                <label>Título</label>
                                                <label className='orga'>{`${filteredPerson.title}`}</label>
                                        </div>

                                        <div className='pe'>
                                                <label htmlFor="uf">Categoria</label>
                                                <label className='orga'>{`${filteredPerson.categorie}`}</label>
                                        </div>

                                        <div className='pes' >
                                                <label htmlFor="uf">Sítio Relacionado</label>
                                                <select className='selecion' name="categoria"
                                                    id="categoria" value={selecteValue} onChange={e => setSelecteValue(e.target.value)}>
                                                    {lista.map((user, index) => (
                                                    <option className='opt'
                                                    id="categoria" value={user.name}>{`${filteredPerson.title}`}</option>
                                                    ))}        
                                                </select>
                                        </div>
                                        </div>


                                    <div className='separ' >
                                    <div className='buttonadd'>
                                        <StAdd
                                        onClick={addQuestButton}
                                        />
                                        ADICIONAR QUESTÃO
                                    </div>

                                        <div>
                                            <StButton 
                                            onClick={addQuestionEditButton}>
                                            CANCELAR
                                            </StButton>
                                        </div>
                                        <div>
                                            <StButton >
                                            SALVAR
                                            </StButton>
                                        </div>
                                </div>

                                    </FormQuiz>

                                    </fieldset>
                                </StFormQuiz>

                                </PaperCadastrarQuiz>
                            </>            
                        ))}

                        


                
            { /* Página editarquizzes depois de clicar editar quiz /parte das questões*/ }
            {questions.filter(question => question.questions ).map(filteredPerson =>(
                
                <>    
                   
                    <PaperCadastrarQuiz ref={divRef} style={{ display: mostrar ? "none" : "block" }}>

                    <StFormQuiz >

                        <fieldset >
                        
                        <form className='question' id='edit_question'>

                            <div>
                                <div className='pe'>
                                        <label>Informe qual será a Pergunta</label>
                                        <label className='pergunta'>{`${filteredPerson.questions[0].question}`}</label>
                                        
                                </div>
                               
                                <div className='respos'>
                                        <p>Resposta Correta</p>
                                        <label className='resposta' >{`${filteredPerson.questions[0].options[0]}`}</label>
                                </div>

                                <div className='respos'>
                                <p>Resposta Incorreta</p>
                                        <label className='resposta' >{`${filteredPerson.questions[0].options[1]}`}</label>
                                </div>

                                <div className='respos'>
                                <p>Resposta Incorreta</p>
                                        <label className='resposta' >{`${filteredPerson.questions[0].options[2]}`}</label>
                                </div>

                                <div className='respos'>
                                <p>Resposta Incorreta</p>
                                        <label className='resposta' >{`${filteredPerson.questions[0].options[3]}`}</label>
                                </div>

                                <div className='respos'>
                                <p>Dica sobre a Resposta</p>
                                        <label className='resposta' >{`${filteredPerson.questions[0].tip}`}</label>
                                </div>
                            

                                {`${filteredPerson.questions[0].answer}`}
                            
                            </div>

                        </form>

                        </fieldset>
                    </StFormQuiz>

                    </PaperCadastrarQuiz>

                    <PaperCadastrarQuiz ref={divRef} style={{ display: mostrar ? "none" : "block" }}>

                    <StFormQuiz >

                        <fieldset >
                        
                        <form className='question' id='edit_question'>

                            <div>
                                <div className='pe'>
                                        <label>Informe qual será a Pergunta</label>
                                        <label className='pergunta'>{`${filteredPerson.questions[1].question}`}</label>
                                        
                                </div>

                                <div className='respos'>
                                <p>Resposta Correta</p> 
                                        <label className='resposta' >{`${filteredPerson.questions[1].options[0]}`}</label>
                                </div>

                                <div className='respos'>
                                <p>Resposta Incorreta</p>
                                        <label className='resposta' >{`${filteredPerson.questions[1].options[1]}`}</label>
                                </div>

                                <div className='respos'>
                                <p>Resposta Incorreta</p>  
                                        <label className='resposta' >{`${filteredPerson.questions[1].options[2]}`}</label>
                                </div>

                                <div className='respos'>
                                <p>Resposta Incorreta</p>   
                                        <label className='resposta' >{`${filteredPerson.questions[1].options[3]}`}</label>
                                </div>
                            

                                {`${filteredPerson.questions[1].answer}`}
                            
                            </div>

                        </form>

                        </fieldset>
                    </StFormQuiz>

                    </PaperCadastrarQuiz>
                </>       
                
            ))}

           
          

          {quest.map(quize => (

                <Paper ref={divRef} style={{ display: amostrando ? "none" : "block" }}>

                <StFormQuiz >

                <fieldset >

                <form className='question' id="create_question" >

                    <div>
                        <div className='pe'>
                                <label>Informe qual será a Pergunta</label>
                                <input name="description" id="description" className='pergunta'></input>
                        </div>

                            <div className='respos'>
                            <p>Resposta Correta</p>
                                    <input  name="resposta1" id="resposta1" className='resposta'/>
                            </div>
                            <div className='respos'>
                            <p>Resposta Incorreta</p>               
                                    <input name="resposta2" id="resposta2" className='resposta'></input>
                            </div>
                            <div  className='respos'>
                            <p>Resposta Incorreta</p>                     
                                    <input name="resposta3" id="resposta3" className='resposta'></input>
                            </div>
                            <div  className='respos'>
                            <p>Resposta Incorreta</p>
                                    <input name="resposta4" id="resposta4" className='resposta'></input>
                            </div>
                            <div  className='respos'>
                            <p>Informe a dica sobre a resposta</p>
                                    <input name="tip" id="tip" className='resposta'></input>
                            </div>
                        
                    </div>

                </form>

                </fieldset>
                </StFormQuiz>

                </Paper>
                ))}
                
                <Paper ref={divRef} style={{ display: amostrando ? "none" : "block" }}>
                <div  className='butolist' >
                        <div>
                            <button className="buttaun"  >
                            CANCELAR
                            </button>                       
                        </div>

                        <div>
                            <button className="buttaun" onClick={cadastrarQuestion} >
                            CADASTRAR
                            </button>
                        </div>

                </div>
                </Paper>
                
                

                {newquest.map(quize => (

                <Paper ref={divRef} style={{ display: aparecer ? "none" : "block" }}>

                <StFormQuiz >

                <fieldset >

                <form className='question' id="create_question" >

                    <div>
                    <div className='pe'>
                            <label>Informe qual será a Pergunta</label>
                            <input name="description" id="description" className='pergunta'></input>
                    </div>

                    <div className='respos'>
                        
                           
                    
                        
                            <input  name="resposta1" id="resposta1" className='resposta'/>
                    </div>
                    <div className='respos'>
                    
                            <input type="radio" className='radio' name="genero_grupo"  />
                    
                            <input name="resposta2" id="resposta2" className='resposta'></input>
                    </div>
                    <div  className='respos'>
                        
                            <input type="radio" className='radio' value="Vdd" name="genero_grupo" />
                        
                            <input name="resposta3" id="resposta3" className='resposta'></input>
                    </div>
                    <div  className='respos'>

                            <input type="radio" className='radio'  value="Vdd" name="genero_grupo" />

                            <input name="resposta4" id="resposta4" className='resposta'></input>
                    </div>

                    </div>

                </form>

                </fieldset>
                </StFormQuiz>

                <div  className='butolist'>
                        <div>
                            <button className="buttau"  >
                            CANCELAR
                            </button>                       
                        </div>

                        <div>
                            <button className="buttau" onClick={cadastrarQuestion} >
                            CADASTRAR
                            </button>
                        </div>

                </div>

                </Paper>
                ))}
                        

                       
            { /* Apagar um campo  :)

            <div>
            <button onClick={() => setShow((s) => !s)}>toggle</button>
            <div style={{ display: show ? "block" : "none" }}>hello</div>
            </div>
           */}
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
