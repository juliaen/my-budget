import { AbstractData } from '../../models/AbstractData'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'
import { AccountDataService } from '../../services/AccountDataService'
import { Chip } from '@mui/material'

interface ExpensesVsIncomeProps {
    datainput: AbstractData[][]
}

interface ExpensesVsIncomeMonth {
    month: string
    expenses: number
    income: number
}

interface Averages {
    balance: number
    expenses: number
    revenues: number
}

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

function calculateAverages(allMonths: ExpensesVsIncomeMonth[]): Averages {
    let averageBalance = 0
    let averageRevenues = 0
    let averageExpenses = 0

    allMonths.forEach((element) => {
        averageBalance += element.expenses + element.income
        averageRevenues += element.income
        averageExpenses += element.expenses
    })

    return {
        balance: Math.round((averageBalance / allMonths.length) * 100) / 100,
        expenses: Math.round((averageExpenses / allMonths.length) * 100) / 100,
        revenues: Math.round((averageRevenues / allMonths.length) * 100) / 100,
    }
}

export const ExpensesVsIncome: React.FunctionComponent<
    ExpensesVsIncomeProps
> = (props: ExpensesVsIncomeProps) => {
    const allMonths: ExpensesVsIncomeMonth[] = []

    props.datainput
        .slice()
        .reverse()
        .forEach((dataElement) => {
            const accountDataService: AccountDataService =
                new AccountDataService(dataElement)
            allMonths.push({
                expenses: accountDataService.getTotalExpense(),
                income: accountDataService.getTotalRevenue(),
                month: dataElement[0].post.toLocaleString('default', {
                    month: 'long',
                }),
            })
        })

    const { balance, revenues, expenses } = calculateAverages(allMonths)

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'bottom' as const,
            },
        },
        showTooltips: true,
        tooltipEvents: [],
    }

    const labels = allMonths.map((month) => {
        return month.month
    })

    const data = {
        labels,
        datasets: [
            {
                label: 'Ausgaben',
                data: allMonths.map((month) => {
                    return month.expenses
                }),
                backgroundColor: '#FF6200',
            },
            {
                label: 'Einnhamen',
                data: allMonths.map((month) => {
                    return month.income
                }),
                backgroundColor: '#333',
            },
            {
                label: 'Bilanz',
                data: allMonths.map((month) => {
                    return month.income + month.expenses
                }),
                backgroundColor: '#525199',
            },
        ],
    }

    return (
        <>
            <div className="w-full flex flex-col bg-white rounded-lg drop-shadow-md  relative">
                <div
                    id="title"
                    className="mb-10 p-4 pb-0 text-xl font-bold text-[#FF6200]"
                >
                    Einahmen und Ausgaben
                </div>
                <div className="flex justify-center absolute w-full top-10 gap-4 mt-3">
                    <div>
                        <div className="px-4 py-2 drop-shadow-lg bg-gray-900 rounded-lg text-white font-semibold text-xl hover:scale-105 transition duration-300">
                            <div className='text-sm font-light justify-center flex flex-row'>
                            Ø Bilanz
                            </div>
                            <div className='flex flex-row justify-center'>
                                {balance > 0 ? '+' : ''}{balance}
                                <div className="text-sm pl-2 pr-3">
                                    {props.datainput[0][0].currencyValue}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="px-4 py-2 drop-shadow-lg bg-gray-900 rounded-lg text-white font-semibold text-xl hover:scale-105 transition duration-300">
                            <div className='text-sm font-light justify-center flex flex-row'>
                            Ø Einnahmen
                            </div>
                            <div className='flex flex-row justify-center'>
                                {revenues > 0 ? '+' : ''}{revenues}
                                <div className="text-sm pl-2 pr-3">
                                    {props.datainput[0][0].currencyValue}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="px-4 py-2 drop-shadow-lg bg-gray-900 rounded-lg text-white font-semibold text-xl hover:scale-105 transition duration-300">
                            <div className='text-sm font-light justify-center flex flex-row'>
                            Ø Ausgaben
                            </div>
                            <div className='flex flex-row justify-center'>
                                {expenses > 0 ? '+' : ''}{expenses}
                                <div className="text-sm pl-2 pr-3">
                                    {props.datainput[0][0].currencyValue}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <Bar options={options} data={data}  className='p-4'/>
            </div>
        </>
    )
}
