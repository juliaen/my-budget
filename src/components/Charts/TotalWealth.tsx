import { AbstractData } from '../../models/AbstractData'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import { AccountDataService } from '../../services/AccountDataService'
import { Chip } from '@mui/material'

interface TotalWealthProps {
    datainput: AbstractData[][]
}

interface TotalWealthMonth {
    start: number
    end: number
    totalSavings: number
    month: string
}

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
)

export const TotalWealth: React.FunctionComponent<TotalWealthProps> = (
    props: TotalWealthProps
) => {
    const allMonths: TotalWealthMonth[] = []

    props.datainput
        .slice()
        .reverse()
        .forEach((dataElement, index) => {
            const accountDataService: AccountDataService =
                new AccountDataService(dataElement)
            let totalSavings = accountDataService.getTotalSavings()

            if (index > 0) {
                totalSavings =
                    accountDataService.getTotalSavings() +
                    allMonths[index - 1].totalSavings
            }

            const element = {
                start: dataElement[dataElement.length - 1].saldo,
                end: dataElement[0].saldo,
                totalSavings,
                month: dataElement[0].post.toLocaleString('default', {
                    month: 'long',
                }),
            }

            allMonths.push(element)
        })
    const options = {
        responsive: true,

        plugins: {
            legend: {
                display: false,
            },
        },
    }

    const totalChange: number =
        allMonths.length > 1
            ? Math.round(
                  (allMonths[allMonths.length - 1].end +
                      allMonths[allMonths.length - 1].totalSavings -
                      (allMonths[0].end + allMonths[0].totalSavings)) *
                      100
              ) / 100
            : Math.round(
                  (allMonths[0].end -
                      allMonths[0].start +
                      allMonths[0].totalSavings) *
                      100
              ) / 100
    const trend: string = totalChange > 0 ? '+' : ''
    const labels =
        allMonths.length > 1
            ? allMonths.map((month) => {
                  return month.month
              })
            : ['Beginn ' + allMonths[0].month, 'Ende ' + allMonths[0].month]

    const data = {
        labels,
        datasets: [
            {
                label: 'Ausgaben',
                data:
                    allMonths.length > 1
                        ? allMonths.map((month) => {
                              return month.end + month.totalSavings
                          })
                        : [allMonths[0].end, allMonths[0].start],
                backgroundColor: '#FF6200',
            },
        ],
    }

    return (
        <div className="w-full flex flex-col bg-white rounded-lg drop-shadow-md mt-3 relative">
            <div id="title" className="mb-10 text-xl font-bold text-[#FF6200] p-4 pb-0">
                Gesamtbilanz
            </div>
            <div className="flex justify-center absolute w-full top-12">
                <div className="px-4 py-4 drop-shadow-lg bg-gray-900 rounded-lg text-white font-semibold text-xl flex flex-row hover:scale-105 transition duration-300">
                    {' '}
                    {trend}
                    {totalChange}
                    <div className="text-sm pl-2 pr-3">
                        {props.datainput[0][0].currencyValue}
                    </div>
                </div>
            </div>
            <Line options={options} data={data} className='px-4 pb-4' />
        </div>
    )
}
