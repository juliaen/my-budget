import { AbstractData } from '../models/AbstractData'

export class AccountAbstractFacade {
    public getAccountAbstractData(file: any[]): AbstractData[] {
        const objects = this.mapToObjects(file)
        return this.mapToAbstractData(objects)
    }

    private mapToObjects(rows: any[]): any[] {
        // Split on row
        for (let index = 0; index < 13; index++) {
            rows.shift()
        }

        // Get first row for column headers
        let headers = rows.shift()

        headers[2] = 'Auftraggeber'
        headers[headers.length - 3] = 'WaehrungSaldo'
        headers[headers.length - 1] = 'WaehrungBetrag'

        let json: any[] = []
        rows.forEach(function (row: any) {
            // Loop through each row
            let tmp: any = {}
            for (var i = 0; i < headers.length; i++) {
                tmp[headers[i]] = row[i]
            }

            // Add object to list
            json.push(tmp)
        })

        json.pop()

        return json
    }

    private mapToAbstractData(data: any[]): AbstractData[] {
        var datePattern = /(\d{2})\.(\d{2})\.(\d{4})/
        return data.map((dataObject: any) => {
            return {
                post: new Date(
                    dataObject.Buchung.replace(datePattern, '$3-$2-$1')
                ),
                valuta: new Date(
                    dataObject.Valuta.replace(datePattern, '$3-$2-$1')
                ),
                recipient: dataObject.Auftraggeber,
                purpose: dataObject.Verwendungszweck,
                saldo: this.parseToNumber(dataObject.Saldo),
                currencySaldo: dataObject.WaehrungSaldo,
                value: this.parseToNumber(dataObject.Betrag),
                currencyValue: dataObject.WaehrungBetrag,
            }
        })
    }

    private parseToNumber(numberAsString: string): number {
        return (
            Math.round(
                Number(numberAsString.replace('.', '').replace(',', '.')) * 100
            ) / 100
        )
    }

    private getMonths(data: AbstractData[]): number[] {
        const months: number[] = []

        data.forEach((element) => {
            const currentMonth = element.post.getMonth()
            if (!months.includes(currentMonth)) {
                months.push(currentMonth)
            }
        })

        return months
    }

    public splitIntoMoths(data: AbstractData[]): AbstractData[][] {
        const months = this.getMonths(data)
        const dataByMonths: AbstractData[][] = []
        months.forEach((month) => {
            const currentMonth: AbstractData[] = []
            data.forEach((dataObject) => {
                if (dataObject.post.getMonth() === month) {
                    currentMonth.push(dataObject)
                }
            })

            dataByMonths.push(currentMonth)
        })

        return dataByMonths
    }
}
