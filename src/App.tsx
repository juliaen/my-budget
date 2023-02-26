import { css, Global } from '@emotion/react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css'
import { DetailsPage } from './components/DetailsPage/DetailsPage'
import { OverViewPage } from './components/OverViewPage/OverViewPage'
import { AbstractDataStateProvider } from './contexts/AbstractDataContext'

function App() {
    const router = createBrowserRouter([
        {
            path: '/',
            element: <OverViewPage></OverViewPage>,
        },
        {
            path: '/data-group-details',
            element: <DetailsPage></DetailsPage>,
        },
    ])

    return (
        <div className="flex justify-center mt-28 px-8 sm:px-20 w-full">
            <div className="max-w-screen-xl w-full">
                <AbstractDataStateProvider>
                    <RouterProvider router={router} />
                </AbstractDataStateProvider>
            </div>
        </div>
    )
}

export default App
