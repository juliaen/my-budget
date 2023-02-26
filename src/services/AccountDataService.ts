import { AbstractData } from '../models/AbstractData'
import { DataGroup } from '../models/DataGroup'

export class AccountDataService {
    private abstractData: AbstractData[]
    private dataGroupsExpenses: DataGroup[]
    private dataGroupsRevenues: DataGroup[]

    constructor(abstractData: AbstractData[]) {
        this.abstractData = abstractData
        this.dataGroupsExpenses = this.createExpensesDataGroups()
        this.dataGroupsRevenues = this.createIncomeDataGroups()
        this.filterIntoDataGroups(
            this.getAllExpenses(),
            this.dataGroupsExpenses
        )
        this.filterIntoDataGroups(
            this.getAllRevenues(),
            this.dataGroupsRevenues
        )
    }

    public getAllExpenses(): AbstractData[] {
        return this.abstractData.filter((dataObject) => {
            return (
                dataObject.value < 0 &&
                dataObject.purpose.toLowerCase() !== 'sparen' &&
                dataObject.purpose.toLowerCase() !== 'notgroschen'
            )
        })
    }

    public getAllRevenues(): AbstractData[] {
        return this.abstractData.filter((dataObject) => {
            return (
                dataObject.value > 0 &&
                dataObject.purpose.toLowerCase() !== 'sparen' &&
                dataObject.purpose.toLowerCase() !== 'notgroschen'
            )
        })
    }

    public getAllSavings(): AbstractData[] {
        return this.abstractData.filter((dataObject) => {
            return (
                dataObject.purpose.toLowerCase() === 'sparen' ||
                dataObject.purpose.toLowerCase() === 'notgroschen' ||
                dataObject.purpose.toLowerCase() === 'kleingeld plus'
            )
        })
    }

    public getTotalExpense(): number {
        let allExpenses = this.getAllExpenses()
        let sum = 0
        allExpenses.forEach((dataObject) => (sum = sum + dataObject.value))

        return Math.round(sum * 100) / 100
    }

    public getTotalRevenue(): number {
        let allRevenues = this.getAllRevenues()
        let sum = 0
        allRevenues.forEach((dataObject) => (sum = sum + dataObject.value))

        return Math.round(sum * 100) / 100
    }

    public getTotalSavings(): number {
        const allSavings = this.getAllSavings()
        let sum = 0
        allSavings.forEach((dataObject) => (sum = sum - dataObject.value))

        return Math.round(sum * 100) / 100
    }

    public getTotalBalance(): number {
        return (
            Math.round(
                (this.getTotalExpense() + this.getTotalRevenue()) * 100
            ) / 100
        )
    }

    private createExpensesDataGroups(): DataGroup[] {
        const insuranceGroup: DataGroup = {
            name: 'Versicherungen',
            tags: ['versicherung'],
            totalValue: 0,
            abstractData: [],
        }

        const telecomminicationGroup: DataGroup = {
            name: 'Telekommunikation',
            tags: ['Vodafone','Telekom'],
            totalValue: 0,
            abstractData: [],
        }

        const rentAndEnergyGroup: DataGroup = {
            name: 'Miete & Energie',
            tags: ['Miete', 'Strom', 'Energie', 'Energy'],
            totalValue: 0,
            abstractData: [],
        }

        const investGroup: DataGroup = {
            name: 'Investieren',
            tags: ['Wertpapierkauf', 'WP-ABRECHNUNG','Trade'],
            totalValue: 0,
            abstractData: [],
        }

        const housholdAndFoodGroup: DataGroup = {
            name: 'Haushalt & Lebensmittel',
            tags: ['Rewe', 'Lidl', 'Aldi', 'Rossmann', 'DM', 'Edeka', 'Bauhaus', 'Lieferando', 'Justeat'],
            totalValue: 0,
            abstractData: [],
        }

        const pets: DataGroup = {
            name: 'Haustiere',
            tags: ['Hund','Tierarzt','Fressnapf','Futterhaus'],
            totalValue: 0,
            abstractData: [],
        }

        const taxGroup: DataGroup = {
            name: 'Steuern & Abgaben',
            tags: ['Rundfunk', 'Steuer'],
            totalValue: 0,
            abstractData: [],
        }

        const bankGroup: DataGroup = {
            name: 'Kredite und Kreditkarte',
            tags: ['Kredit', 'Kreditkarte'],
            totalValue: 0,
            abstractData: [],
        }

        const onlineShoppingGroup: DataGroup = {
            name: 'Online Shopping',
            tags: ['Amazon', 'ebay', 'Zalando'],
            totalValue: 0,
            abstractData: [],
        }

        const streamingGroup: DataGroup = {
            name: 'Streaming',
            tags: [
                'Streaming',
                'Netflix',
                'Disney',
                'Spotify',
                'WOW',
                'Youtube',
                'Google',
                'Prime Video',
            ],
            totalValue: 0,
            abstractData: [],
        }

        const otherGroup: DataGroup = {
            name: 'Sonstiges',
            tags: ['Other'],
            totalValue: 0,
            abstractData: [],
        }

        return [
            insuranceGroup,
            telecomminicationGroup,
            rentAndEnergyGroup,
            housholdAndFoodGroup,
            investGroup,
            taxGroup,
            streamingGroup,
            bankGroup,
            onlineShoppingGroup,
            pets,
            otherGroup,
        ]
    }

    private createIncomeDataGroups(): DataGroup[] {
        const salaryGroup: DataGroup = {
            name: 'Gehalt',
            tags: ['Gehalt', 'Lohn', 'Rente'],
            totalValue: 0,
            abstractData: [],
        }

        const otherGroup: DataGroup = {
            name: 'Sonstiges',
            tags: ['Other'],
            totalValue: 0,
            abstractData: [],
        }

        return [salaryGroup, otherGroup]
    }

    private filterIntoDataGroups(
        data: AbstractData[],
        dataGroups: DataGroup[]
    ) {
        data.forEach((dataObject) => {
            // eslint-disable-next-line
            dataGroups.some((dataGroup) => {
                var regex = new RegExp(dataGroup.tags.join('|'), 'i')

                if (
                    regex.test(dataObject.purpose) ||
                    regex.test(dataObject.recipient) ||
                    dataGroup.tags.includes('Other')
                ) {
                    dataGroup.abstractData.push(dataObject)
                    dataGroup.totalValue += dataObject.value
                    dataGroup.totalValue =
                        Math.round(dataGroup.totalValue * 100) / 100
                    return true
                }
            })
        })
    }

    public getExpensesDataGroups() {
        return this.dataGroupsExpenses
    }

    public getRevenuesDataGroups() {
        return this.dataGroupsRevenues
    }
}
