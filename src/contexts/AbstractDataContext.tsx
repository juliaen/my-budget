import {
    createContext,
    Dispatch,
    SetStateAction,
    useContext,
    useReducer,
    useState,
} from 'react'
import { AbstractData } from '../models/AbstractData'
import { DataGroup } from '../models/DataGroup'

export interface AbstractDataContextState {
    state: {
        data: AbstractData[][] | undefined
        selectedDataGroup: DataGroup | undefined
    }
}

const AbstractDataContext = createContext({
    state: {} as Partial<AbstractDataContextState>,
    setState: {} as Dispatch<SetStateAction<Partial<AbstractDataContextState>>>,
})

const AbstractDataStateProvider = ({
    children,
    value = {} as AbstractDataContextState,
}: {
    children: React.ReactNode
    value?: Partial<AbstractDataContextState>
}) => {
    const [state, setState] = useState(value)
    return (
        <AbstractDataContext.Provider value={{ state, setState }}>
            {children}
        </AbstractDataContext.Provider>
    )
}

const useAbstractDataState = () => {
    const context = useContext(AbstractDataContext)
    if (!context) {
        throw new Error(
            'useAbstractDataState must be used within a AbstractDataContext'
        )
    }
    return context
}

export { AbstractDataStateProvider, useAbstractDataState }
