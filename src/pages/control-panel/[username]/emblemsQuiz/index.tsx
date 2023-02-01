import {
    useRef,
    useState
} from 'react'
import { FormHandles, SubmitHandler } from '@unform/core'
import { GetServerSideProps } from 'next'
import { parseCookies } from 'nookies'

import { Flex } from './Flex';

import { Box } from './Box';



import {
    Container,
    Paper,
    EmblemGold,
    EmblemSilver,
    EmblemBronzi,
    Copy
} from '../../../../styles/pages/shared/control-panel.styles'
import { SidebarLayout } from '../../../../components/layouts/sidebar-layout-quiz'
import { AUTH_TOKEN_KEY } from '../../../../contexts/auth'
import { Loading } from '../../../../components/Loading'


function Upload() {

    const [isLoading, setIsLoading] = useState(false)
    const divRef = useRef<HTMLDivElement>(null)
    return (
        <Container>

            <Paper ref={divRef}>
            <h2 className='emblem'>Emblemas Cadastrados</h2>
            <Flex
            padding={5}
            bgColor=""
            height="210px"
            container
            justifyContent="space-evenly"
            alignItems="flex-start"
            >
                <EmblemBronzi   />

                <EmblemSilver />

                <EmblemGold/>
            </Flex>
        <Flex
            padding={6}
            bgColor=""
            height="60px"
            container
            justifyContent="space-evenly"
            alignItems="initial"

        >

            <h3>30 Pontos no Quiz </h3>

            <h3>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;50 Pontos no Quiz</h3>

            <h3>&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;80 Pontos no Quiz</h3>


        </Flex >
            <h3 className='msg'>Ao participar do quiz o usuário recebe o emblema para classificação no ranking.</h3>


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
