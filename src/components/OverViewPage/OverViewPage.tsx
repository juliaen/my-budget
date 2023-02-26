import { Categories, CategoryMode } from '../Charts/Categories'
import { ExpensesVsIncome } from '../Charts/ExpensesVsIncome'
import { FileInput } from '../FileInput'
import { TotalWealth } from '../Charts/TotalWealth'
import { StyledDoughnutColumn, StyledDoughnutRow } from './OverViewPage.styled'
import { useAbstractDataState } from '../../contexts/AbstractDataContext'
import { DateTime } from 'luxon'
import InstallPWA from '../InstallPWA'
import { Button } from '@mui/material'



export const OverViewPage: React.FunctionComponent = (props) => {
    const { state } = useAbstractDataState()
    let dateStart = ''
    let dateEnd = ''

    if (state.state?.data) {
        dateEnd = DateTime.fromJSDate(
            state.state?.data[0][0].post
        ).toLocaleString({ year: '2-digit', month: 'short' })
        dateStart = DateTime.fromJSDate(
            state.state?.data[state.state?.data.length - 1][0].post
        ).toLocaleString({ year: '2-digit', month: 'short' })
    }

    return (
        <div>
            {state.state?.data === undefined &&
                <div>
                    <FileInput />
                    <InstallPWA />
                </div>
            }
            {state.state?.data !== undefined &&
                state.state?.data.length > 0 && (
                    <div>
                        <div className="bg-gray-900 flex flex-row py-20 rounded-b-3xl w-full absolute top-0 left-0">
                            <div
                                onClick={() => {}}
                                className="text-white ml-5 mr-10 flex flex-col self-center justify-items-center hover:text-gray-400"
                            ></div>
                            <div className="flex flex-col grow">
                                <p className="text-gray-400 text-l ml-1 mb-3">
                                    Willkommen zu deinem
                                </p>
                                <div className="flex flex-row">
                                    <p className="text-white font-bold text-3xl ml-1">
                                        Haushaltsbuch und Analysen
                                    </p>
                                </div>
                                <div className='mt-3'>
                                <Button style={{borderColor: '#FF6200', borderWidth: '1.5px', color: '#FF6200', fontSize: '0.7rem'}} variant='outlined' onClick={() => window.location.reload()}>Neuen Kontoauszug hochladen</Button>
                                </div>
                            </div>
                            <div className="flex flex-col self-center mx-10 bg-gray-800 rounded-full py-1 px-3">
                                <p className="text-white">
                                    {dateStart.toUpperCase()} -{' '}
                                    {dateEnd.toUpperCase()}
                                </p>
                            </div>
                        </div>
                        <div className="mt-20 pt-10"></div>
                        <div className='flex flex-col gap-6 mb-10'>
                            <TotalWealth datainput={state.state?.data} />
                            <ExpensesVsIncome datainput={state.state?.data} />
                            <div className='flex flex-row gap-6'>
                                <StyledDoughnutColumn>
                                    <Categories
                                        datainput={state.state?.data}
                                        mode={CategoryMode.expenses}
                                    />
                                </StyledDoughnutColumn>
                                <StyledDoughnutColumn>
                                    <Categories
                                        datainput={state.state?.data}
                                        mode={CategoryMode.revenues}
                                    />
                                </StyledDoughnutColumn>
                            </div>
                        </div>
                    </div>
                )}
        </div>
    )
}
