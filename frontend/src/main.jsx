import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { ToastContainer, Bounce  } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';


import './index.css'
import App from './App.jsx'
import store from './Store/index.js'

createRoot(document.getElementById('root')).render(
  // <StrictMode>
  <Provider store={store} >
    <App />
    <ToastContainer
      position="top-center"
      autoClose={2000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick={false}
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
      transition={Bounce}
      // style={{ zIndex: 20000000 }}
    />
  </Provider>
  // {/* </StrictMode>, */}
)
