# Haushaltsbuch und Analysen für ING-Kontoauszüge
Mit dieser App können automatisch Kontoauszüge der ING analysiert werden. Ob einzelene Tage oder mehrere Monate spielt keine Rolle. Es werden keine Daten übertragen und die App kann lokal und offline genutzt werden.

## Einrichten und Starten

Es müssen beim ersten Mal nur folgende Schritte nacheinander ausgeführt werden:

1. `npm i`
2. `npm run build`
3. `npx serve -s build`

Anschließend kann die App auch als PWA installiert werden, so muss später nicht erneut der Server gestartet werden.

## Kontoauszug herunterladen
Über die Webapp der ING kann im Bereich Umsätze ein Zeitraum ausgewählt werden und anschließend am unteren Ende der Seite als CSV exportiert werden.

## Konfigurieren und weitere Hinweise

Die Inhaltsgruppen für die Analyse der Einahmen und Ausgaben können im `AccountDataService.ts` in den Funktionen `createExpensesDataGroups()` und `createIncomeDataGroups()` angepasst werden. Die dort hinterlegten Tags werden jeweils in den Feldern `Auftraggeber/Empfänger` oder `Verwendungszweck` gesucht. 

Überweisungen auf ein Tagesgeldkonto werden nicht als Ausgabe gewertet, dazu muss der Verwendugszweck das Wort `sparen` oder `notgroschen` beeinhalten.


