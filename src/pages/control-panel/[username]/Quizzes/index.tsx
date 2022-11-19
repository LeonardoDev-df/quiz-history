import App from './App';
import React from 'react';
import { QuizProvider } from "../../../../context/quiz";
import {
    ContQuiz
} from '../../../../styles/pages/shared/control-panel.styles'
import { SidebarLayout } from '../../../../components/layouts/sidebar-layout-quiz'





function Upload() {

    return (
        <>
        <React.StrictMode >

          <QuizProvider>
              <App />
          </QuizProvider>

        </React.StrictMode>
      </>
    )
}

Upload.Layout = SidebarLayout

export default Upload










