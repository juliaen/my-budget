import { Doughnut, getElementAtEvent } from 'react-chartjs-2'
import { useRef, useState } from 'react'
import { AbstractData } from '../../models/AbstractData'
import { DataGroup } from '../../models/DataGroup'
import { AccountDataService } from '../../services/AccountDataService'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    ArcElement,
    Title,
} from 'chart.js'
import { FormControl, InputLabel, Select, MenuItem, Chip } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import {
    AbstractDataContextState,
    useAbstractDataState,
} from '../../contexts/AbstractDataContext'

ChartJS.register(CategoryScale, LinearScale, ArcElement, Title)

interface CategoriesProps {
    datainput: AbstractData[][]
    mode: CategoryMode
}

interface CategoriesMonth {
    month: string
    totalBalance: number
    dataGroups: DataGroup[]
}

export enum CategoryMode {
    expenses,
    revenues,
}

export const Categories: React.FunctionComponent<CategoriesProps> = (
    props: CategoriesProps
) => {
    const [selectedMonth, setSelectedMonth] = useState<number>(0)
    const navigate = useNavigate()
    const allMonths: CategoriesMonth[] = []
    const { setState, state } = useAbstractDataState()

    props.datainput
        .slice()
        .reverse()
        .forEach((dataElement) => {
            const accountDataService: AccountDataService =
                new AccountDataService(dataElement)
            allMonths.push({
                dataGroups:
                    props.mode === CategoryMode.expenses
                        ? accountDataService.getExpensesDataGroups()
                        : accountDataService.getRevenuesDataGroups(),
                totalBalance:
                    props.mode === CategoryMode.expenses
                        ? accountDataService.getTotalExpense()
                        : accountDataService.getTotalRevenue(),
                month: dataElement[0].post.toLocaleString('default', {
                    month: 'long',
                }),
            })
        })

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
            }
        },
    }

    const labels = allMonths[0].dataGroups.map((group) => {
        return group.name
    })

    const chartRef = useRef()

    const submitDataGroup = (data: Partial<AbstractDataContextState>) => {
        setState((prev) => ({ ...prev, ...data }))
    }

    const onClick = (event: any) => {
        const clickedGroupIndex: number = getElementAtEvent(
            chartRef.current!,
            event
        )[0].index
        submitDataGroup({
            state: {
                data: state.state?.data,
                selectedDataGroup:
                    allMonths[selectedMonth].dataGroups[clickedGroupIndex],
            },
        })
        navigate('/data-group-details')
    }

    const data = {
        labels,
        datasets: [
            {
                label: 'Gesamtsumme',
                data: allMonths[selectedMonth].dataGroups.map((group) => {
                    return group.totalValue
                }),
                backgroundColor: [
                    '#525199',
                    '#000333',
                    '#FF6200',
                    '#525199',
                    '#000333',
                    '#FF6200',
                    '#525199',
                    '#000333',
                    '#FF6200',
                    '#525199',
                    '#000333',
                    '#FF6200',
                ],
                borderColor: [
                    '#FFFFFF',
            
                ],
                borderWidth: 3,
            },
        ],
    }

    return (
        <>
            <div className='w-full flex flex-col bg-white rounded-lg drop-shadow-md relative'>
                <div id='title' className='mb-10 pb-3 text-xl font-bold text-[#FF6200] m-4'>Gesamte {props.mode === CategoryMode.expenses ? 'Ausgaben' : 'Einnahmen'}</div>
                <div className='flex justify-center absolute w-full top-16 gap-4 mt-3 hover:scale-105 transition duration-300'>
                    <div>
                        <div className='px-4 py-4 drop-shadow-lg bg-gray-900 rounded-lg text-white font-semibold text-xl flex flex-row'>{allMonths[selectedMonth].totalBalance}<div className='text-sm pl-2 pr-3'>{props.datainput[0][0].currencyValue}</div></div>
                    </div>
                </div>
                <Doughnut
                    className='p-4'
                    data={data}
                    options={options}
                    onClick={onClick}
                    ref={chartRef}
                />
                <FormControl fullWidth>
                    <InputLabel id="month-select-label" className='m-4'>Monat</InputLabel>
                    <Select
                        className='m-4'
                        labelId="month-select-label"
                        id="month-select"
                        label="Monat"
                        value={selectedMonth}
                        onChange={(event) => {
                            setSelectedMonth(parseInt(event.target.value as string))
                        }}
                    >
                        {allMonths.map((month, index) => {
                            return (
                                <MenuItem value={index} key={index}>
                                    {month.month}
                                </MenuItem>
                            )
                        })}
                    </Select>
                </FormControl>
            </ div>
        </>
    )
}
