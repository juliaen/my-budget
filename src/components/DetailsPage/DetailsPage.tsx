import { DateTime } from 'luxon'
import { useAbstractDataState } from '../../contexts/AbstractDataContext'
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import { useNavigate } from 'react-router-dom'

export const DetailsPage: React.FunctionComponent = (props) => {
    const { state } = useAbstractDataState()

    const dataGroup = state.state?.selectedDataGroup
    const month = DateTime.fromJSDate(
        dataGroup?.abstractData[0].post!
    ).toLocaleString({ month: 'short' })
    const year = DateTime.fromJSDate(dataGroup?.abstractData[0].post!).year

    const navigate = useNavigate()
    const navigateBack = () => navigate(-1)
    return (
        <div>
            <div className="bg-gray-900 flex flex-row py-20 rounded-b-3xl w-full absolute top-0 left-0">
                <div
                    onClick={navigateBack}
                    className="text-white ml-5 mr-10 flex flex-col self-center hover:text-gray-400"
                >
                    <ArrowBackRoundedIcon fontSize="large" />
                </div>
                <div className="flex flex-col grow">
                    <p className="text-gray-400 text-l ml-1 mb-3">
                        {dataGroup?.name}
                    </p>
                    <div className="flex flex-row">
                        <p className="text-white font-bold text-3xl ml-1">
                            {dataGroup?.totalValue}
                        </p>
                        <p className="text-white font-bold text-l ml-2">
                            {dataGroup?.abstractData[0].currencySaldo}
                        </p>
                    </div>
                </div>
                <div className="flex flex-col self-center mx-10 bg-gray-800 rounded-full py-1 px-3">
                    <p className="text-white">
                        {month.toUpperCase()} {year}
                    </p>
                </div>
            </div>
            <div className="mt-20 pt-10">
                {dataGroup !== undefined &&
                    dataGroup.abstractData.map((entry) => {
                        return (
                            <>
                                <div className="flex row m-4 p-4 drop-shadow-lg hover:scale-105 transition duration-300 bg-white rounded-lg overflow-hidden">
                                    <div className="w-5 mr-6 bg-[#FF6200] -m-4"></div>
                                    <div className="flex self-start grow flex-col justify-between">
                                        <div className="pb-2 text-[#000066] font-semibold">
                                            {entry.recipient}
                                        </div>
                                        <p className="pt-1 text-gray-400">
                                            {entry.post.toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="flex self-center">
                                        <p className="py-1 pl-3 text-[#000066] font-bold text-xl">
                                            {entry.value}
                                        </p>
                                        <p className="py-1 pl-2 pr-3 text-[#000066] font-bold text-sm">
                                            {entry.currencyValue}
                                        </p>
                                    </div>
                                </div>
                            </>
                        )
                    })}
            </div>
        </div>
    )
}
