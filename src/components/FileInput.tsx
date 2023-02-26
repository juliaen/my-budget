import { Alert, Button, Snackbar } from '@mui/material'
import Papa from 'papaparse'
import { AbstractData } from '../models/AbstractData'
import { AccountAbstractFacade } from '../facades/AccountAbstractFacade'
import React, { useContext } from 'react'
import {
    AbstractDataContextState,
    useAbstractDataState,
} from '../contexts/AbstractDataContext'
import { color } from '@mui/system'

export const FileInput: React.FunctionComponent = (props) => {
    const { setState, state } = useAbstractDataState()
    const [open, setOpen] = React.useState(false);

    const accountAbstractFacade: AccountAbstractFacade =
        new AccountAbstractFacade()

    const submitFunction = (data: Partial<AbstractDataContextState>) => {
        setState((prev) => ({ ...prev, ...data }))
    }

    const changeHandler = (e: any) => {
        const files = e.target.files
        if (files) {
            Papa.parse(files[0], {
                newline: '\n',
                delimiter: ';',
                header: false,
                complete: function (results) {
                    try{
                        const result = accountAbstractFacade.getAccountAbstractData(
                            results.data as any[][]
                        )
                        const splitted =
                            accountAbstractFacade.splitIntoMoths(result)
                        submitFunction({
                            state: {
                                data: splitted,
                                selectedDataGroup: state.state?.selectedDataGroup,
                            },
                        })
                    } catch (e) {
                       setOpen(true);
                    }
                },
            })
        }
    }

    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
          return;
        }
    
        setOpen(false);
      };

    return (
        <div className='bg-white drop-shadow-lg px-10 py-20 rounded-xl'>
            <div className="flex flex-col grow">
                <div className="flex flex-col">
                    <p className="text-[#FF6200] font-bold text-3xl ml-1">
                    Willkommen,
                    </p>
                    <p className="text-[#FF6200] font-bold text-xl ml-1">
                    zu deinem Haushaltsbuch und Analysen
                    </p>
                </div>
                <p className="text-gray-400 text-l ml-1 mb-10 mt-5">
                    Zum Starten einen Kontoauszug für den gewünschten Zeitraum als CSV hochladen.
                </p>
            </div>
            <Button
            className='flex-1 w-full'
            component="label"
            variant="outlined"
            style={{borderColor: '#FF6200', borderWidth: '1.5px', color: '#FF6200'}}
            sx={{ marginRight: '1rem' }}
            >
                <div className='py-2'>
                    Upload CSV
                    <input type="file" accept=".csv" hidden onChange={changeHandler} />
                </div>
            </Button>
            <Snackbar anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}open={open} autoHideDuration={6000} onClose={handleClose}>
                <Alert  onClose={handleClose} severity="error">
                    Die Datei konnte nicht gelesen werden.
                </Alert>
            </Snackbar>
        </div>
    )
}
