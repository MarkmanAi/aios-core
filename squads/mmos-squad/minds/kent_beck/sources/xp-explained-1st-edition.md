# Extreme Programming Explained — 1st Edition (Kent Beck, 1999)

**Pages:** 207
**Extracted:** 2026-02-23
**Type:** primary-book

---


--- PAGE 1 ---
Extreme Programming
--- PAGE 2 ---
Programmer’s Choice
--- PAGE 3 ---
Kent Beck
Extreme Programming
Die revolutionäre Methode 
für Softwareentwicklung in kleinen T eams
An imprint of Pearson Education
München  Boston  San Francisco  Harlow, England
Don Mills, Ontario  Sydney  Mexico City
Madrid  Amsterdam

--- PAGE 4 ---
Die Deutsche Bibliothek – CIP-Einheitsaufnahme
Ein Titeldatensatz für diese Publikation ist bei
Der Deutschen Bibliothek erhältlich.
Die Informationen in diesem Produkt werden 
ohne Rücksicht auf einen eventuellen Patentschutz veröffentlicht.
Warennamen werden ohne Gewährleistung 
der freien Verwendbarkeit benutzt. 
Bei der Zusammenstellung von Texten und Abbildungen 
wurde mit größter Sorgfalt vorgegangen. 
Trotzdem können Fehler nicht vollständig ausgeschlossen werden. 
Verlag, Herausgeber und Autoren 
können für fehlerhafte Angaben und deren Folgen weder eine 
juristische Verantwortung noch irgendeine Haftung übernehmen. 
Für Verbesserungsvorschläge und Hinweise 
auf Fehler sind Verlag und Herausgeber dankbar. 
Alle Rechte vorbehalten, auch die der fotomechanischen Wiedergabe 
und der Speicherung in elektronischen Medien. 
Die gewerbliche Nutzung der in diesem Produkt 
gezeigten Modelle und Arbeiten ist nicht zulässig. 
Fast alle Hardware- und Softwarebezeichnungen, die in diesem Buch erwähnt werden, 
sind gleichzeitig auch eingetragene Warenzeichen oder sollten als solche betrachtet werden. 
Umwelthinweis: 
Dieses Produkt wurde auf chlorfrei gebleichtem Papier gedruckt.
Die Einschrumpffolie – zum Schutz vor Verschmutzung – ist aus umweltverträglichem und recyclingfähigem
PE-Material.
10   9   8   7   6   5   4   3   2    
03   02   01   
Die amerikanische Originalausgabe ist erschienen bei Addison-Wesley USA unter 
dem Titel »Extreme Programming Explained. Embrace Change«, ISBN 0-201-61641-6
© 2000 by Kent Beck
ISBN 3-8273-2139-5
© 2000 by Addison-Wesley Verlag,
ein Imprint der Pearson Education Deutschland GmbH 
Martin-Kollar-Straße 10–12, D-81829 München/Germany
Alle Rechte vorbehalten
Einbandgestaltung: Christine Rechl, München
Titelbild: Aconitum, Eisenhut. © Karl Blossfeldt Archiv –
Ann und Jürgen Wilde, Zülpich/VG Bild-Kunst Bonn, 2001.
Übersetzung: Ingrid Tokar für trans-it, München
Lektorat: Susanne Spitzer, sspitzer@pearson.de
Korrektorat: Andrea Stumpf
Herstellung: Anna Plenk, aplenk@pearson.de
Satz: reemers publishing services gmbh, Krefeld. Gesetzt aus der Stone Serif 9 pt.
Druck und Verarbeitung: Mediaprint, Paderborn
Printed in Germany
--- PAGE 5 ---
Für meinen Vater
Ich danke Cindee Andres, meiner Frau und Partnerin, die darauf bestand, dass
ich mich nicht um sie kümmere und stattdessen schreibe. Ich danke Bethany,
Lincoln, Lindsey, Forrest und Joelle, die einige Zeit auf mich verzichtet haben,
damit ich tippen konnte.
--- PAGE 7 ---
Inhaltsverzeichnis
Vorwort xiii
Einleitung xv
Teil 1 Das Problem 1
1 Risiko: Das Grundproblem 3
Unser Ziel 5
2 Eine Entwicklungsepisode 7
3 Die ökonomische Seite der Softwareentwicklung 11
Optionen 12
Beispiel 13
4 Vier Variablen 15
Abhängigkeiten zwischen den Variablen 15
Auf den Umfang konzentrieren 18
5 Kosten von Änderungen 21
6F a h r e n  l e r n e n  2 7
7 Vier Werte 29
Kommunikation 29
Einfachheit 30
Feedback 31
Mut 33
Die Werte in der Praxis 34
8G r u n d p r i n z i p i e n  3 7
9 Zurück zu den Grundlagen 43
Programmieren 44
Testen 45
Zuhören 48
Design entwerfen 48
Schlussfolgerung 50
--- PAGE 8 ---
viii Inhaltsverzeichnis
Teil 2 Die L ösung 51
10 Kurzer Überblick 53
Das Planungsspiel 54
Kurze Releasezyklen 56
Metapher 56
Einfaches Design 57
Testen 57
Refactoring 58
Programmieren in Paaren 58
Gemeinsame Verantwortlichkeit 59
Fortlaufende Integration 60
40-Stunden-Woche 60
Kunde vor Ort 61
Programmierstandards 62
11 Wie kann das funktionieren? 63
Das Planungsspiel 63
Kurze Releasezyklen 64
Metapher 64
Einfaches Design 65
Testen 65
Refactoring 65
Programmieren in Paaren 66
Gemeinsame Verantwortlichkeit 67
Fortlaufende Integration 67
40-Stunden-Woche 68
Kunde vor Ort 68
Programmierstandards 69
Schlussfolgerung 69
12 Managementstrategie 71
Messdaten 72
Coaching 73
Terminmanagement 74
Intervention 75
--- PAGE 9 ---
Inhaltsverzeichnis ix
13 Strategie hinsichtlich der Arbeitsumgebung 77
14 Gesch äftliche und technische Verantwortung trennen 81
Geschäftsseite 81
Entwicklungsseite 82
Was tun? 82
Wahl der Technologie 83
Was passiert, wenn es schwierig wird? 84
15 Planungsstrategie 85
Das Planungsspiel 86
Das Ziel 87
Die Strategie 87
Die Spielelemente 88
Die Spieler 88
Die Spielzüge 89
Erforschungsphase 89
Verpflichtungsphase 90
Steuerungsphase 91
Iterationsplanung 91
Erforschungsphase 92
Verpflichtungsphase 92
Steuerungsphase 93
In einer Woche planen 96
16 Entwicklungsstrategie 97
Fortlaufende Integration 97
Gemeinsame Verantwortlichkeit 99
Programmieren in Paaren 100
17 Designstrategie 103
Die einfachste Lösung 103
Wie funktioniert das Design durch Refactoring? 106
Was ist das Einfachste? 108
Wie kann das funktionieren? 109
Rolle der Bilder im Design 111
Systemarchitektur 113
--- PAGE 10 ---
x Inhaltsverzeichnis
18 Teststrategie 115
Wer schreibt Tests? 117
Weitere Tests 119
Teil 3 XP implementieren 121
19 XP übernehmen 123
20 XP anpassen 125
Testen 126
Design 127
Planung 127
Management 128
Entwicklung 128
In Schwierigkeiten? 129
21 Lebenszyklus eines idealen XP-Projekts 131
Erforschung 131
Planung 133
Iterationen bis zur ersten Version 133
In Produktion gehen 134
Wartung 135
Tod 137
22 Rollenverteilung 139
Programmierer 140
Kunde 142
Tester 144
Terminmanager 144
Coach 145
Berater 146
Big Boss 147
23 Die 20:80-Regel 149
24 Was macht XP schwierig? 151
25 Wann man XP nicht ausprobieren sollte 155
--- PAGE 11 ---
Inhaltsverzeichnis xi
26 XP in der Praxis 159
Festpreis 159
Outsourcing 160
Insourcing 161
Abrechnung nach Aufwand 162
Abschlussbonus 162
Vorzeitige Beendigung 163
Frameworks 163
Kommerzielle Produkte 164
27 Schlussfolgerung 165
Erwartung 166
A Kommentierte Bibliografie 167
B Glossar 177
Stichwortverzeichnis 179
--- PAGE 13 ---
Vorwort
Extreme Programming (XP) erklärt das Programmieren zur Schlüsselaktivität
während der gesamten Dauer eines Softwareprojekts. Das kann unmöglich funk-
tionieren!
Es ist an der Zeit, einen Moment lang über meine eigene Entwicklungsarbeit
nachzudenken. Ich arbeite in einer Just-in-Time-Softwarekultur mit kurzen
Releasezyklen und hohem technischen Risiko. Sich mit Änderungen anzufreun-
den ist hier eine Überlebensstrategie. Die Kommunikation in und zwischen
Teams, die sich oft an unterschiedlichen Orten befinden, erfolgt über den Quell-
code. Wir lesen den Code, um neue oder sich in Entwicklung befindende APIs
von Subsystemen zu verstehen. Der Lebenszyklus und das Verhalten eines kom-
plexen Objekts wird durch Testfälle festgelegt, also wiederum durch Code.
Berichte über Probleme stammen von Testfällen, die das Problem demonstrieren
und wiederum in Codeform vorliegen. Schließlich verbessern wir fortlaufend den
vorhandenen Code durch Refactoring. Unsere Entwicklung ist zwar codezent-
riert, aber es gelingt uns trotzdem, Software termingemäß zu liefern und daher
scheint diese Form der Entwicklung zu funktionieren.
Man darf daraus nicht schlussfolgern, dass man einfach nur draufloszuprogram-
mieren braucht, um erfolgreich Software zu produzieren. Software zu produzie-
ren ist schwer und Software pünktlich zu produzieren ist noch schwerer. Damit
dies gelingt, muss man zusätzlich bewährte Verfahren diszipliniert einsetzen. An
diesem Punkt setzt Kent Becks anregendes Buch über XP ein.
Kent Beck gehört zu den Leitern von Tektronics, die das Potenzial des Program-
mierens in wechselnden Paaren in Smalltalk für komplexe technische Anwen-
dungen erkannt haben. Zusammen mit Ward Cunningham trug er viel zur Pat-
tern-Bewegung bei, die auf meine Laufbahn großen Einfluss hatte. XP ist ein
Ansatz der Softwareentwicklung, der Verfahren kombiniert, die von vielen
erfolgreichen Programmierern eingesetzt wurden, aber in der Unmenge von Lite-
ratur zum Thema Softwareprozesse und -methoden untergingen. Wie Muster
baut XP auf bewährten Verfahren auf, so z.B. Komponententests, Programmieren
in Paaren und Refactoring. In XP werden diese Verfahren kombiniert, sodass sie
sich gegenseitig ergänzen und häufig auch kontrollieren. Der Schwerpunkt liegt
auf dem Zusammenspiel der verschiedenen Verfahren, wodurch dieses Buch
einen wichtigen Beitrag leistet. Es gibt nur ein Ziel, nämlich Software mit der
richtigen Funktionalität termingerecht zu liefern. Auch wenn OTIs erfolgreicher
Just-in-Time-Softwareprozess nicht reines XP ist, weist er viele Gemeinsamkeiten
mit XP auf.
--- PAGE 14 ---
xiv  Vorwort
Mir hat die Zusammenarbeit mit Kent Beck und das Üben von XP-Episoden an
einem kleinen Ding namens Junit Spa ß gemacht. Seine Ansichten und Ans ätze
stellen eine st ändige Herausforderung f ür die Art und Weise dar, in der ich die
Softwareentwicklung angehe. Zweifellos stellt XP einige der traditionellen
Ansätze gro ßer Methodologien infrage. Mithilfe dieses Buches werden Sie ent-
scheiden können, ob Sie XP gutheißen oder nicht.
Erich Gamma
--- PAGE 15 ---
Einleitung
Dies ist ein Buch zum Thema Extreme Programming (XP). XP ist eine kompakte
Methode zur Entwicklung von Software in kleinen bis mittelgroßen Teams, deren
Arbeit vagen oder sich rasch ändernden Anforderungen unterliegt. Dieses Buch
soll Ihnen bei der Entscheidung helfen, ob XP für Sie geeignet ist.
Einige Leute sind der Meinung, XP entspräche ganz einfach dem gesunden Men-
schenverstand. Sie mögen sich nun fragen, warum der Name dann das Wort
»extrem« enthält. XP setzt allgemein als vernünftig anerkannte Prinzipien und
Verfahren in extremer Weise ein.
 Wenn Code Reviews gut sind, dann begutachten wir den Code andauernd
(Programmieren in Paaren, engl. pair programming).
 Wenn Testen gut ist, dann testet jeder andauernd (Komponententests, engl.
unit tests), auch der Kunde (Funktionstests, engl. functional tests).
 Wenn Design gut ist, dann machen wir es zur alltäglichen Aufgabe (Refacto-
ring).
 Wenn Einfachheit gut ist, dann wählen wir stets dasjenige System, das das
einfachste Design aufweist und die geforderte Funktionalität unterstützt (die
einfachste Lösung, engl. the simplest thing that could possibly work).
 Wenn die Architektur wichtig ist, dann ist jeder andauernd darum bemüht,
die Architektur zu definieren und zu verbessern (Metapher, engl. metaphor).
 Wenn Integrationstests wichtig sind, dann integrieren und testen wir mehr-
mals täglich (fortlaufende Integration, engl. continuous integration).
 Wenn kurze Iterationszeiten gut sind, dann machen wir sie wirklich kurz –
Sekunden, Minuten und Stunden statt Wochen, Monate und Jahre (das Pla-
nungsspiel, engl. Planning Game).
Als ich XP zum ersten Mal formulierte, hatte ich das Bild von Reglern auf einem
Steuerpult im Kopf. Jeder Regler war ein Verfahren, von dem ich aus Erfahrung
wusste, dass es gut funktioniert. Ich wollte alle Regler auf 10 aufdrehen und
sehen, was dann passieren würde. Überraschenderweise erwies sich dieses Paket
von Verfahren als stabil, vorhersehbar und flexibel.
XP verspricht zweierlei:
 Programmierern verspricht XP, dass sie jeden Tag an etwas arbeiten werden,
was wirklich wichtig ist. Sie müssen sich heiklen Situationen nicht allein stel-
len. Sie werden in der Lage sein, alles in ihrer Macht Stehende zu tun, um
--- PAGE 16 ---
xvi  Einleitung
ihrem System zum Erfolg zu verhelfen. Sie werden nur solche Entscheidungen
fällen, die sie auch f ällen können, und werden nicht gezwungen, Entschei-
dungen zu treffen, für die sie nicht qualifiziert sind.
 Kunden und Managern verspricht XP, dass die Programmierzeit optimal
genutzt wird. Alle paar Wochen können sie konkrete Fortschritte im Hinblick
auf die Ziele sehen, die ihnen wichtig sind. Sie werden in der Lage sein, mit-
ten in der Entwicklung die Richtung des Projekts zu ändern, ohne dadurch
exorbitante Kosten zu verursachen.
Kurzum, XP verspricht, die Projektrisiken zu reduzieren, besser auf Ver änderun-
gen der gesch äftlichen Anforderungen reagieren zu k önnen, die Produktivit ät
über die gesamte Lebensdauer des Projekts hinweg zu erhöhen und die Erstellung
von Software im Team zu etwas zu machen, was Spaß macht – und zwar alles auf
einmal. Wirklich. Hören Sie auf zu lachen. Lesen Sie einfach weiter, dann werden
Sie herausfinden, ob ich verrückt bin.
Zu diesem Buch
Dieses Buch handelt von dem Denken, das hinter XP steht – den Ursprüngen, der
Philosophie, den Geschichten und Mythen. Es will Sie in den Stand setzen, eine
wohl erwogene Entscheidung darüber treffen zu können, ob sich XP für Ihr Pro-
jekt eignet oder nicht. Wenn Sie dieses Buch lesen und dann richtigerweise ent-
scheiden, XP nicht in Ihrem Projekt einzusetzen, habe ich mein Ziel ebenso
erreicht, wie wenn Sie richtigerweise entscheiden, XP zu verwenden. Ein weiteres
Ziel dieses Buchs besteht darin, denjenigen, die XP bereits einsetzen, zu helfen,
XP besser zu verstehen.
In diesem Buch geht es nicht darum, zu erklären, wie man Extreme Programming
eigentlich genau durchf ührt. Sie finden hier weder viele Listen von Bedingun-
gen, die unbedingt erfüllt sein müssen, noch viele Beispiele oder Programmierge-
schichten. Dazu müssen Sie online gehen, mit einigen der Coachs sprechen, die
hier erwähnt werden, auf das Erscheinen entsprechender Bücher mit praktischen
Anleitungen zu diesem Thema warten oder einfach Ihre eigene Version erfinden.
Die weitere Akzeptanz von XP hängt von den Leuten ab (Sie gehören möglicher-
weise dazu), die mit der Art und Weise, in der die Softwareentwicklung derzeit
praktiziert wird, unzufrieden sind. Diese Leute suchen nach einem besseren Ver-
fahren der Softwareentwicklung, sie wollen eine bessere Beziehung zum Kunden
und zufriedenere und produktivere Programmierer. Mit anderen Worten, sie wol-
len Erfolge und scheuen sich nicht davor, neue Ideen auszuprobieren, um sie zu
erreichen. Aber wenn man ein Risiko eingeht, m öchte man auch davon über-
zeugt sein, dass man nicht einfach dumm ist.
--- PAGE 17 ---
 Was ist XP? xvii
XP lehrt Sie, anders an die Dinge heranzugehen und steht dabei manchmal in
absolutem Widerspruch zu anerkannten Herangehensweisen. Derzeit erwarte
ich, dass diejenigen, die sich f ür den Einsatz von XP entscheiden, überzeugende
Gründe daf ür haben, anders an die Dinge herangehen zu wollen. Sind diese
Gründe gegeben, dann sollten Sie nicht lange z ögern. Ich schrieb dieses Buch,
um Ihnen Gründe an die Hand zu geben.
Was ist XP?
Was ist XP? XP ist eine leichte, effiziente, risikoarme, flexible, kalkulierbare,
exakte und vergnügliche Art und Weise der Softwareentwicklung. XP unterschei-
det sich von anderen Methoden durch:
 frühzeitige, konkrete und fortwährende Feedbacks durch kurze Zyklen
 einen inkrementellen Planungsansatz, bei dem schnell ein allgemeiner Plan
entwickelt wird, der über die Lebensdauer des Projekts hinweg weiterentwi-
ckelt wird
 die Fähigkeit, die Implementierung von Leistungsmerkmalen flexibel zu pla-
nen und dabei die sich ändernden geschäftlichen Anforderungen zu ber ück-
sichtigen
 die Abhängigkeit von automatisierten Tests, die von den Programmierern und
den Kunden geschrieben werden, um den Entwicklungsfortgang zu überwa-
chen, das System weiterzuentwickeln und Mängel frühzeitig zu erkennen
 das Vertrauen darauf, dass m ündliche Kommunikation, Tests und Quellcode
die Struktur und den Zweck des Systems zum Ausdruck bringen
 die Abh ängigkeit von einem evolution ären Designprozess, der so lange
andauert, wie das System besteht
 das Vertrauen auf die Zusammenarbeit von Programmierern mit ganz
gewöhnlichen Fähigkeiten
 die Abhängigkeit von Verfahren, die sowohl den kurzfristigen Instinkten der
Programmierer als auch den langfristigen Interessen des Projekts entgegen-
kommen
XP ist eine Disziplin der Softwareentwicklung. Es ist eine Disziplin, weil es
bestimmte Dinge gibt, die man tun muss, wenn man XP einsetzen will. Man
kann es sich nicht aussuchen, ob man automatisierte Tests schreibt oder nicht –
wenn man es nicht tut, dann ist es auch kein XP; Ende der Diskussion.
--- PAGE 18 ---
xviii  Einleitung
XP ist für Projekte konzipiert, die sich mit Teams von zwei bis zehn Programmie-
rern umsetzen lassen, die durch die vorhandene EDV-Umgebung in keinem
besonders hohen Ma ße eingeschr änkt sind und bei denen vern ünftige Tests
innerhalb weniger Stunden ausgeführt werden können.
XP verschreckt und ver ärgert einige Leute, die diesem Konzept zum ersten Mal
begegnen. Allerdings sind die Ideen von XP keineswegs neu. Die meisten sind so
alt wie das Programmieren. In dieser Hinsicht ist XP konservativ – alle XP-Tech-
niken haben sich über Jahrzehnte (was die Implementierungsstrategie betrifft)
oder Jahrhunderte (was die Managementstrategie betrifft) bewährt.
Das Innovative an XP ist:
 Es bringt all diese Verfahren unter einen Hut.
 Es stellt sicher, dass diese Verfahren möglichst gründlich ausgeübt werden.
 Es stellt sicher, dass sich diese Verfahren im h öchsten Maß gegenseitig st üt-
zen.
Was ist genug?
In seinen Büchern The Forest People und The Mountain People zeichnet der Anthro-
pologe Colin Turnbull Bilder zweier gegens ätzlicher Gesellschaften. In den Ber-
gen waren die Ressourcen rar und die Menschen immer von der Gefahr des Ver-
hungerns bedroht. Dort entwickelte sich eine schreckliche Kultur. M ütter
überließen ihre Kinder herumstreifenden Horden verwilderter Kinder, sobald sie
allein überleben konnten. Gewalt, Brutalität und Betrug waren an der Tagesord-
nung.
Im Gegensatz dazu gab es im Wald gen ügend Ressourcen. Ein Mensch konnte
innerhalb einer halben Stunde seinen Tagesbedarf decken. Die Waldkultur war
der Bergkultur genau entgegengesetzt. Die Erwachsenen zogen die Kinder
gemeinsam auf, die so lange ern ährt und umsorgt wurden, bis sie in der Lage
waren, für sich selbst zu sorgen. Wenn ein Mensch versehentlich einen anderen
tötete (vorsätzliche Verbrechen kannte man nicht), wurde er ins Exil geschickt;
aber er musste nur ein kleines St ück in den Wald gehen und dort nur einige
Monate bleiben und selbst dann brachten ihm andere Stammesmitglieder
Geschenke in Form von Nahrung.
XP ist ein Experiment, das folgende Frage beantworten soll: »Wie w ürde man
programmieren, wenn man genug Zeit h ätte?« Wir können uns nicht mehr Zeit
nehmen, da es schließlich immer noch um ein Geschäft geht und wir mitspielen,
--- PAGE 19 ---
 Gliederung xix
weil wir gewinnen wollen. Aber wenn man genug Zeit h ätte, dann w ürde man
Tests schreiben, man w ürde das System umstrukturieren, wenn es angebracht
erschien, man w ürde viel mit den anderen Programmierern und mit dem Kun-
den reden.
Solch eine Mentalit ät der Zul änglichkeit ist menschlich, im Gegensatz zu der
erbarmungslosen Plackerei nicht einhaltbarer, auferlegter Termine, die so viele
begabte Programmierer aus der Programmierung vertreibt. Die Mentalit ät der
Zulänglichkeit zahlt sich aber auch geschäftlich aus. Sie schafft ihre eigenen Effi-
zienzen, ebenso wie die Mentalit ät des Mangels ihre eigene Verschwendung
erzeugt.
Gliederung
Dieses Buch ist so geschrieben, als würden Sie und ich zusammen eine neue Dis-
ziplin der Softwareentwicklung schaffen. Wir überprüfen zuerst unsere Grundan-
nahmen über die Softwareentwicklung. Dann arbeiten wir die eigentliche Diszi-
plin aus. Wir überprüfen die Implikationen der von uns geschaffenen Disziplin
und ziehen Schlussfolgerungen daraus – wie man sie sich aneignen kann, wann
sie nicht übernommen werden sollte und welche Möglichkeiten sich in geschäft-
licher Hinsicht daraus ergeben.
Dieses Buch ist in drei Teile gegliedert:
 Das Problem: Kapitel 1, »Risiko: Das Grundproblem «, bis Kapitel 9, »Zurück
zu den Grundlagen«, beschreiben das Problem, das Extreme Programming zu
lösen versucht, und stellen Kriterien zur Einschätzung der Lösung vor.
 Die Lösung: In Kapitel 10, »Kurzer Überblick«, bis Kapitel 18, »Teststrategien«,
werden die abstrakten Ideen des ersten Teils in Verfahren einer konkreten
Methodik umgewandelt. Dieser Teil erl äutert nicht, wie Sie diese Verfahren
im Einzelnen umsetzen, sondern deren allgemeine Form. Die einzelnen Ver-
fahren werden vor dem Hintergrund des Problems und der Prinzipien, die im
ersten Teil eingeführt wurden, besprochen.
 XP implementieren: Kapitel 19, »XP übernehmen«, bis Kapitel 26, »XP in der
Praxis«, beschreiben eine Reihe von Themen, die mit der Implementierung
von XP in Zusammenhang stehen – wie man XP umsetzt, was von den ver-
schiedenen Leuten in einem XP-Projekt erwartet wird, wie sich XP der
Geschäftsseite gegenüber darstellt.
--- PAGE 20 ---
xx  Einleitung
Danksagung
Ich schreibe hier nicht in der ersten Person, weil es sich um meine Ideen handelt,
sondern weil dies meine Perspektive auf diese Ideen ist. Die meisten XP-Verfah-
ren sind so alt wie das Programmieren selbst.
Ward Cunningham ist meine unmittelbare Quelle für einen Großteil dessen, was
Sie hier lesen. In vielerlei Hinsicht habe ich die letzten fünfzehn Jahre damit ver-
bracht, anderen Leuten das zu erklären, was er intuitiv tut. Ich danke Ron Jeffries
dafür, es versucht und dann viel besser gemacht zu haben. Ich danke Martin
Fowler dafür, es auf nicht beängstigende Weise erklärt zu haben. Ich danke Erich
Gamma für die langen Gespr äche, während wir die Schw äne im Limmat beob-
achtet haben, und dafür, dass er mich nicht mit nicht durchdachten Schlussfol-
gerungen hat davonkommen lassen. Und nichts von all dem h ätte stattgefun-
den, wenn ich nicht meinem Vater Doug Beck über Jahre hinweg beim
Programmieren zugesehen hätte.
Ich danke dem C3-Team bei Chrysler daf ür, mir gefolgt zu sein und mich dann
auf dem Weg zum Gipfel überholt zu haben. Mein besonderer Dank gilt unseren
Managern Sue Unger und Ron Savage f ür ihren Mut, als sie uns die Chance
gaben, es auszuprobieren.
Ich danke Daedalos Consulting f ür die Unterst ützung beim Schreiben dieses
Buchs.
Der Ehrentitel eines Meisterrezensenten wird an Paul Chisholm verliehen f ür
seine umfassenden, aufmerksamen und h äufig wirklich l ästigen Kommentare.
Ohne sein Feedback wäre dieses Buch nicht halb so gut.
Ich habe die Zusammenarbeit mit meinen ersten Lesern und Gutachtern wirklich
genossen. Zumindest haben sie mir enorm geholfen. Ich kann ihnen nicht genug
dafür danken, sich durch meine Prosa gek ämpft zu haben, die f ür manche in
einer fremden Sprache vorlag. Ich danke hier folgenden Personen (die in der
zufälligen Reihenfolge aufgef ührt werden, in der ich ihre Kommentare gelesen
habe): Greg Hutchinson, Massimo Arnoldi, Dave Cleal, Sames Schuster, Don
Wells, Joshua Kerievsky, Thorsten Dittmar, Moritz Becker, Daniel Gubler, Chris-
toph Henrici, Thomas Zang, Dierk K önig, Miroslav Novak, Rodney Ryan, Frank
Westphal, Paul Trunz, Steve Hayes, Kevin Bradtke, Jeanine De Guzman, Tom
Kubit, Falk Br ügmann, Hasko Heinecke, Peter Merel, Rob Mee, Pete McBreen,
Thomas Ernst, Guido Hächler, Dieter Holz, Martin Knecht, Dirk Krampe, Patrick
Lisser, Elisabeth Maier, Thomas Mancini, Alexio Moreno, Rolf Pfenninger und
Matthias Ressel.
--- PAGE 21 ---
Teil 1
Das Problem
Dieser Teil zeigt, innerhalb welchen Rahmens Extreme Programming sinnvoll ist,
indem verschiedene Seiten des Problems erläutert werden, das durch eine neue
Disziplin der Softwareentwicklung gelöst werden soll. Es werden die Grundan-
nahmen besprochen, die wir bei der Auswahl von Verfahren für verschiedene
Aspekte der Softwareentwicklung unterstellen – die treibende Metapher, die vier
Werte, die von diesen Werten abgeleiteten Prinzipien und die Maßnahmen, die
durch unsere neue Entwicklungsdisziplin strukturiert werden sollen.
--- PAGE 23 ---
1 Risiko: Das Grundproblem
Die Softwareentwicklung kann die Erwartungen nicht erfüllen. Dieses Scheitern hat
weitreichende Auswirkungen im geschäftlichen und menschlichen Bereich. Wir müssen
einen neuen Weg finden, Software zu entwickeln.
Das Grundproblem der Softwareentwicklung besteht im Risiko. Es folgen einige
Beispiele für dieses Risiko:
 Terminverzögerungen – Der Liefertermin naht und Sie müssen dem Kunden
sagen, die Software wird erst in sechs Monaten fertig.
 Projektabbruch – Nach mehreren Terminverzögerungen wird das Projekt ein-
gestellt, ohne jemals die Produktreife erreicht zu haben.
 Das System wird unrentabel – Die Software wird erfolgreich in Betrieb genom-
men, aber nach ein paar Jahren steigen die Kosten für die Durchführung von
Änderungen oder die Fehlerrate so stark an, dass das System ausgetauscht wer-
den muss.
 Fehlerrate – Die Software wird in Betrieb genommen, hat jedoch eine so hohe
Fehlerrate, dass sie nicht verwendet wird.
 Das Geschäftsziel wurde falsch verstanden – Die Software wird in Betrieb
genommen, löst aber nicht das ursprüngliche Problem.
 Das Geschäftsziel ändert sich – Die Software wird in Betrieb genommen, aber
das Problem, das sie ursprünglich lösen sollte, wurde durch ein anderes, drin-
genderes Geschäftsproblem abgelöst.
 Falsche Funktionsfülle – Die Software verfügt über eine Unmenge von poten-
ziell interessanten Funktionen, deren Programmierung Spaß gemacht hat, die
jedoch dem Kunden keinen Gewinn bringen.
 Personalwechsel – Nach zwei Jahren werden alle guten Programmierer des
Projekts überdrüssig und kündigen.
Sie werden auf diesen Seiten mehr über Extreme Programming (XP) erfahren, das
mit Risiken auf allen Ebenen des Entwicklungsprozesses umgehen kann. XP ist
zudem sehr produktiv, ermöglicht qualitativ hochwertige Software und macht in
der Praxis großen Spaß.
Wie geht XP mit den oben angeführten Risiken um?
--- PAGE 24 ---
4 1 Risiko: Das Grundproblem
 Terminverzögerungen – XP fordert kurze Releasezyklen mit einer maximalen
Dauer von einigen Monaten, so dass sich Terminverz ögerungen immer im
Rahmen halten. In XP werden innerhalb eines Releases in ein- bis vierw öchi-
gen Iterationen vom Kunden geforderte Funktionen implementiert, damit
dieser ein detailliertes Feedback zum Arbeitsfortschritt erhält. Innerhalb einer
Iteration wird in XP in Schritten von ein bis drei Tagen geplant, damit das
Team bereits w ährend einer Iteration Probleme l ösen kann. Schlie ßlich for-
dert XP, dass die Funktionen mit der h öchsten Priorität zuerst implementiert
werden, so dass diejenigen Funktionen, die sich nicht zum geforderten Liefer-
termin realisieren lassen, von geringerer Bedeutung sind.
 Projektabbruch – XP fordert den Kunden auf, die kleinste, gesch äftlich sinn-
volle Version zu w ählen, sodass weniger schief gehen kann, bevor die Soft-
ware die Produktionsreife erreicht, und die Software den größten Wert hat.
 Das System wird unrentabel – XP erstellt und beh ält eine umfassende Menge
von Tests bei, die nach jeder Änderung (mehrmals t äglich) ausgeführt wer-
den, um sicherzustellen, dass die Qualit ätsanforderungen erfüllt werden. XP
hält das System stets in erstklassigem Zustand. Man l ässt nicht zu, dass sich
Schrott ansammelt.
 Fehlerrate – XP testet sowohl aus der Perspektive der Programmierer, indem
Tests zur Überprüfung einzelner Funktionen geschrieben werden, als auch aus
der Perspektive des Kunden, indem Tests zur Überprüfung der einzelnen Leis-
tungsmerkmale des Programms entwickelt werden.
 Das Geschäftsziel wurde falsch verstanden – XP macht den Kunden zum Mit-
glied des Teams. Die Projektspezifikation wird während der Entwicklung fort-
während weiter ausgearbeitet, sodass sich Lernerfahrungen des Teams und des
Kunden in der Software widerspiegeln können.
 Das Geschäftsziel ändert sich – XP verkürzt die Releasezyklen und daher tre-
ten innerhalb des Entwicklungszeitraums einer Version weniger Änderungen
auf. Während der Entwicklung einer Version kann der Kunde neue Funktio-
nen durch Funktionen ersetzen, die bislang noch nicht implementiert sind.
Das Team bemerkt nicht einmal, ob es an neu hinzugekommenen Funktio-
nen arbeitet oder an Leistungsmerkmalen, die vor Jahren definiert wurden.
 Falsche Funktionsf ülle – XP besteht darauf, dass nur die Aufgaben mit der
höchsten Priorität angegangen werden.
 Personalwechsel – XP fordert von den Programmierern, dass sie f ür die Auf-
wandsschätzung und die Fertigstellung der eigenen Aufgaben selbst die Ver-
antwortung übernehmen (engl. accepted responsibility), gibt ihnen Feedback
--- PAGE 25 ---
 Unser Ziel 5
über die tatsächliche Fertigstellungsdauer, damit sie ihre Einsch ätzung realis-
tischer treffen k önnen, und respektiert diese Sch ätzung. Es gibt klare Regeln
dafür, wer solche Einschätzungen vornehmen und ändern kann. Daher ist es
unwahrscheinlicher, dass Programmierer frustriert werden, weil jemand etwas
offensichtlich Unmögliches von ihnen verlangt. XP fördert auch die Kommu-
nikation im Team und d ämpft damit das Gef ühl der Vereinsamung, das oft
Grund der Unzufriedenheit mit einer Position ist. Schlie ßlich beinhaltet XP
ein Modell f ür den Personalwechsel. Neue Teammitglieder werden dazu
ermutigt, nach und nach immer mehr Verantwortung zu übernehmen, und
erhalten w ährend der Arbeit voneinander und von vorhandenen Program-
mierern Unterstützung.
Unser Ziel
Wo suchen wir die L ösung, wenn wir davon ausgehen, dass Projektrisiken das
Problem darstellen? Wir müssen hierzu einen neuen Stil in der Softwareentwick-
lung schaffen, der auf diese Risiken eingeht. Wir m üssen Programmierer, Mana-
ger und Kunden m öglichst verständlich über diese Disziplin unterrichten. Wir
müssen Richtlinien festlegen, wie sich diese Disziplin an örtliche Gegebenheiten
(engl. local adaption) anpassen lässt (also klar machen, was fix und was variabel
ist).
Darum geht es in den Teilen 1 und 2 dieses Buchs. Wir werden uns Schritt f ür
Schritt mit den verschiedenen Aspekten des Problems, wie man einen neuen Stil
bzw. eine neue Disziplin der Softwareentwicklung entwirft, besch äftigen, und
dann werden wir das Problem l ösen. Ausgehend von einer Reihe von Grundan-
nahmen werden wir L ösungen ableiten, die festlegen, wie verschiedene Arbeits-
bereiche der Softwareentwicklung – Planung, Test, Entwicklung, Design und
Deployment – ausgeführt werden sollten.
--- PAGE 27 ---
2 Eine Entwicklungsepisode
Die tägliche Programmierarbeit reicht von Aufgaben, die eindeutig mit einem vom Kun-
den gewünschten Leistungsmerkmal verknüpft sind, über Tests, Implementierung,
Design bis zur Integration. Zumindest in geringem Maße kommen all diese Arbeiten bei
der Softwareentwicklung in jeder Episode vor.
Zuerst wollen wir aber kurz vorausblicken auf das von uns angestrebte Ziel. Die-
ses Kapitel beschreibt das Herzstück von XP – die Entwicklungsepisode. Hier im-
plementieren die Programmierer eine Programmieraufgabe (die kleinste Termin-
planungseinheit) und integrieren sie in das übrige System.
Ich sehe mir meinen Stapel mit Taskcards an. Auf der obersten steht: »Aktuelle
Quartalszahlen zu Abgaben exportieren.« Ich kann mich erinnern, dass du bei
dem spontanen Meeting heute Morgen gesagt hast, du wärst mit der Berechnung
der aktuellen Quartalszahlen fertig. Ich frage dich, ob du (mein hypothetischer
Teamgefährte) Zeit hast, mir beim Export zu helfen. »Sicher«, sagst du. Die Regel
besagt, dass du »Ja« sagen musst, wenn dich jemand um Hilfe bittet. Wir sind
gerade Partner beim Programmieren in Paaren geworden.
Wir diskutieren einige Minuten, was du gestern getan hast. Wir reden über die
Bins, die du hinzugefügt hast, wie die Tests aussehen und vielleicht auch darü-
ber, dass dir gestern aufgefallen ist, dass das Programmieren in Paaren (engl. pair
programming) besser funktioniert, wenn man den Monitor ca. 30 cm weiter
nach hinten rückt.
Wir sehen uns die Struktur einiger der vorhandenen Exporttestfälle an. Wir fin-
den einen, der beinahe unseren Anforderungen entspricht. Durch die Abstrak-
tion einer Oberklasse können wir unseren Testfall mühelos implementieren. Wir
nehmen die erforderliche Modifikation vor. Wir führen die vorhandenen Tests
durch. Sie funktionieren alle einwandfrei.
Du fragst: »Wie sehen die Testfälle für diese Aufgabe aus?«
Ich antworte: »Wenn wir die Exportstation ausführen, sollten die Werte im
Exportdatensatz den Werten in den Bins entsprechen.«
»Welche Felder müssen mit Werten gefüllt werden?«, fragst du.
»Ich weiß es nicht. Lass uns Hans fragen.«
Wir unterbrechen Hans bei seiner Arbeit etwa 30 Sekunden lang. Er erklärt uns
die fünf Felder, von denen er weiß, dass sie etwas mit den Quartalszahlen zu tun
haben.
--- PAGE 28 ---
8 2 Eine Entwicklungsepisode
Wir bemerken, dass sich die von uns erstellte Superklasse in einigen anderen
Exporttestfällen nutzen lie ße. Da wir bei unserer Aufgabe Ergebnisse sehen
möchten, schreiben wir auf unsere To-do-Karte »AbstractExportTest anpassen«.
Nun schreiben wir den Testfall. Da wir gerade die Superklasse f ür den Testfall
erstellt haben, ist es einfach, den Testfall zu schreiben. Wir sind damit in weni-
gen Minuten fertig. Etwa auf halbem Weg sage ich, »Ich kann mir gut vorstellen,
wie wir dies implementieren werden. Wir können...«
»Lass uns erst den Testfall zu Ende bringen«, unterbrichst du mich. Während wir
den Testfall schreiben, haben wir Ideen f ür drei verschiedene Varianten. Du
notierst diese auf der To-do-Karte.
Wir stellen den Testfall fertig und f ühren ihn aus. Er funktioniert nicht. Nat ür-
lich. Wir haben bislang ja noch nichts implementiert. »Warte mal «, sagst du.
»Gestern früh haben Ralph und ich an einem Rechnerprogramm gearbeitet. Wir
schrieben die ersten fünf Testfälle, von denen wir annahmen, dass sie nicht funk-
tionieren würden. Bis auf einen haben sie aber alle gleich beim ersten Mal funk-
tioniert.«
Wir bearbeiten den Testfall mit dem Debugger. Wir sehen uns die Objekte an,
mit denen wir rechnen müssen.
Ich schreibe den Code (oder du, je nachdem, wer die klarste Vorstellung davon
hat). Während wir mit der Implementierung besch äftigt sind, fallen uns einige
weitere Testfälle ein, die wir schreiben sollten. Wir notieren dies auf der To-do-
Karte. Der Testfall wird einwandfrei ausgeführt.
Wir nehmen uns den n ächsten Testfall vor und dann den n ächsten. Ich imple-
mentiere sie. Du bemerkst, dass man den Code vereinfachen k önnte. Du ver-
suchst, mir zu erkl ären, wie man ihn vereinfacht. Es nervt mich, dir zuzuh ören
und gleichzeitig zu implementieren, also schiebe ich die Tastatur zu dir hin über.
Du überarbeitest den Code. Du führst die Testfälle aus. Sie laufen. Du implemen-
tierst die nächsten Testfälle.
Nach einer Weile schauen wir auf die To-do-Karte und sehen, dass nur noch die
Umstrukturierung der übrigen Testfälle zu erledigen ist. Da bislang alles reibungs-
los funktioniert hat, machen wir uns an die Umstrukturierung dieser Testf älle
und vergewissern uns, dass die überarbeiteten Testfälle fehlerfrei ausgeführt wer-
den.
Die To-do-Karte ist jetzt leer. Wir sehen, dass der Integrationsrechner frei ist. Wir
laden die letzte Version. Dann laden wir unsere Änderungen. Dann laden wir
sämtliche Testf älle, die neuen und auch jene, die von den anderen bisher
--- PAGE 29 ---
2 Eine Entwicklungsepisode 9
geschrieben worden sind. Ein Test schlägt fehl. »Seltsam. Es ist fast einen Monat
her, seit bei mir das letzte Mal ein Test w ährend der Integration fehlgeschlagen
ist«, sagst du. Kein Problem. Wir debuggen den Testfall und korrigieren den
Code. Dann führen wir sämtliche Tests noch einmal aus. Diesmal klappt es. Wir
geben unseren Code nun frei.
So sieht also der gesamte XP-Entwicklungszyklus aus:
 Ein Paar von Programmierern programmiert gemeinsam den Code.
 Die Entwicklung wird durch Tests gesteuert. Man testet zuerst und program-
miert dann. Man ist erst fertig, wenn s ämtliche Tests fehlerfrei ausgef ührt
werden. Wenn alle Tests funktionieren und einem keine weiteren Tests einfal-
len, die fehlschlagen könnten, dann sind alle Funktionen hinzugefügt.
 Die Programmiererpaare sorgen nicht nur daf ür, dass die Tests ausgef ührt
werden. Sie entwickeln auch das Design des Systems. Änderungen sind nicht
auf einen bestimmten Bereich beschränkt. Die Programmiererpaare tragen zur
Analyse, zum Design, zur Implementierung und zum Testen des Systems bei.
Sie leisten ihren Beitrag überall dort, wo das System dies erfordert.
 Die Integration schließt sich unmittelbar an die Programmierung an und ent-
hält Integrationstests.
--- PAGE 31 ---
3 Die ökonomische Seite der 
Softwareentwicklung
Wir müssen unsere Softwareentwicklung in wirtschaftlicher Hinsicht wertvoller
machen, indem wir langsamer Geld ausgeben, schneller Einnahmen erzielen und die
wahrscheinliche produktive Lebensdauer unserer Projekte verlängern. Aber vor allem
müssen wir mehr Raum für Geschäftsentscheidungen schaffen.
1
Indem wir die Cashflows addieren, die in ein und aus einem Projekt fließen, kön-
nen wir ohne Weiteres erschließen, was den Wert eines Softwareprojekts aus-
macht. Wenn wir den Einfluss von Zinssätzen berücksichtigen, können wir den
aktuellen Nettowert der Cashflows berechnen. Wir können unsere Analyse wei-
ter verfeinern, indem wir die diskontierten Cashflows darauf umlegen, mit wel-
cher Wahrscheinlichkeit das Projekt diese Gelder ausgeben oder verdienen kann.
Mithilfe der folgenden drei Faktoren
 ein- und ausgehende Cashflows
Z i n s s ä t z e
 Projektlebensdauer
können wir eine Strategie zur Maximierung des wirtschaftlichen Werts eines Pro-
jekts finden. Wir können zu diesem Zweck
 weniger ausgeben, was schwierig ist, da jeder in etwa mit den gleichen Hilfs-
mitteln und Kenntnissen beginnt
 mehr verdienen, was nur mithilfe einer fantastischen Marketing- und Ver-
triebsorganisation möglich ist – Themen, auf die wir in diesem Buch (zum
Glück) nicht eingehen
 später Geld ausgeben und früher verdienen, damit wir weniger Zinsen für das
von uns ausgegebene Geld zahlen und mehr Zinsen für das von uns verdiente
Geld erhalten
 die Wahrscheinlichkeit erhöhen, dass das Projekt am Leben bleibt, sodass wir
mit größerer Wahrscheinlichkeit in einer späteren Phase des Projekts das
große Geld machen
1. Ich bedanke mich bei John Favaro für seine wirtschaftliche Analyse von XP unter
Berücksichtigung dieser Optionen.
--- PAGE 32 ---
12 3 Die ökonomische Seite der Softwareentwicklung
Optionen
Man kann die ökonomische Seite eines Softwareprojekts auch auf andere Weise
betrachten, nämlich als eine Reihe von Optionen. Das Softwareprojektmanage-
ment hätte dann vier Möglichkeiten:
 Es kann das Projekt einstellen – Auch wenn man ein Projekt abbricht, kann
man Gewinn daraus ziehen. Je mehr Wert man aus einem Projekt sch öpfen
kann, das nicht in der urspr ünglich vorgesehenen Form fertig gestellt wird,
desto besser.
 Das Projekt kann ge ändert werden – Man kann die Richtung eines Projekts
ändern. Eine Projektmanagementstrategie ist mehr wert, wenn die Kunden
während des Projekts die Anforderungen ändern können. Je h äufiger und je
stärker die Anforderungen geändert werden können, desto besser.
 Es kann aufgeschoben werden – Man kann warten, bis sich eine Situation von
selbst geklärt hat, bevor man investiert. Eine Projektmanagementstrategie ist
mehr wert, wenn man mit Investitionen warten kann, ohne diese M öglich-
keit komplett einzubüßen. Je länger der Aufschub und je höher die aufgescho-
bene Summe, desto besser.
 Das Projekt kann wachsen – Wenn es so aussieht, als w ürde ein Markt explo-
dieren, dann kann man rasch wachsen, um diese Situation auszunutzen. Eine
Projektmanagementstrategie ist mehr wert, wenn sie das Projekt auf eine
wachsende Produktion einstellen kann, wobei eine höhere Investition voraus-
gesetzt wird. Je schneller und länger das Projekt wachsen kann, desto besser.
Die Berechnung des Wertes dieser Optionen ist zu zwei Teilen Kunst, zu fünf Tei-
len Mathematik und zu einem Teil Augenmaß.
Hierbei sind fünf Faktoren zu berücksichtigen:
 Die Höhe der Investition, die für eine Option erforderlich ist
 Der Preis, den der Gewinn kostet, wenn man die Option ausführt
 Der aktuelle Wert des Gewinns
 Die Zeitdauer, über die man die Optionen hinweg ausführen kann
 Die Unsicherheit hinsichtlich des möglichen Wertes des Gewinns
Von diesen Faktoren ist der letzte f ür den Wert der Optionen in der Regel ma ß-
geblich. Ausgehend davon, können wir konkrete Vorhersagen machen. Nehmen
wir an, wir finden eine Projektmanagementstrategie, die den Wert des Projekts,
das unter dem Gesichtspunkt dieser Optionen analysiert wurde, maximiert,
indem sie Folgendes bietet:
--- PAGE 33 ---
 Beispiel 13
 Genaue und häufige Feedbacks über den Arbeitsfortschritt
 Viele Möglichkeiten, die Anforderungen stark abzuändern
 Eine kleinere Anfangsinvestition
 Die Möglichkeit für raschere Entwicklung
Je größer die Unsicherheit ist, desto wertvoller wird diese Strategie werden. Dies
gilt unabh ängig davon, ob die Unsicherheit durch technische Risiken, sich
ändernde Marktbedingungen oder sich rasch fortentwickelnde Anforderungen
bedingt ist. (Damit ist die theoretische Antwort auf die Frage gegeben, wann man
XP einsetzen soll. Man sollte XP immer dann einsetzen, wenn die Anforderun-
gen vage sind oder sich ständig ändern.)
Beispiel
Angenommen, Sie programmieren fröhlich vor sich hin und stellen fest, dass Sie
ein Leistungsmerkmal hinzuf ügen k önnten, das Sie 10 DM kosten w ürde. Sie
schätzen, dass dieses Leistungsmerkmal etwa 15 DM einbringen wird (sein gegen-
wärtiger Wert). Daher ist der aktuelle Nettowert des Hinzuf ügens dieses Leis-
tungsmerkmals 5 DM.
Nehmen wir an, Sie w üssten tief in Ihrem Innersten, dass es nicht ganz klar ist,
wie viel dieses neue Leistungsmerkmal wert sein wird – Sie haben das gesch ätzt,
es ist nicht so, dass Sie mit Sicherheit wissen, es ist dem Kunden 15 DM wert. Sie
nehmen sogar an, der Wert f ür den Kunden kann bis zu 100% von Ihrer Auf-
wandsschätzung (engl. estimation) abweichen. Nehmen wir weiter an (siehe
Abschnitt »Kosten von Änderungen« in Kapitel 5), dass es Sie auch in einem Jahr
noch 10 DM kosten würde, das Leistungsmerkmal hinzuzufügen.
Welchen Wert h ätte eine Strategie des Abwartens, also das Leistungsmerkmal
jetzt nicht zu implementieren? Bei den üblichen Zinssätzen von etwa 5% kommt
ein Wert von 7,87 DM heraus.
Die Option des Wartens ist mehr wert als das Leistungsmerkmal jetzt hinzuzuf ü-
gen (aktueller Nettowert = 5 DM). Warum? Bei einem so gro ßen Unsicherheits-
faktor ist das Leistungsmerkmal dem Kunden möglicherweise sehr viel mehr wert
und dann sind Sie nicht schlechter dran, wenn Sie warten, statt das Leistungs-
merkmal jetzt zu implementieren. Oder dem Kunden liegt gar nichts daran und
dann haben Sie sich viel Mühe gespart.
Im Wirtschaftsjargon spricht man davon, dass »Optionen das Verlustrisiko aus
dem Weg räumen.«
--- PAGE 35 ---
4 Vier Variablen
Wir werden vier Variablen in unseren Projekten kontrollieren – Kosten, Zeit, Qualität
und Umfang. Von diesen Variablen stellt Umfang die für uns wertvollste Steuerungs-
möglichkeit dar.
Im Folgenden erläutern wir Ihnen ein von einem System mit Steuerungsvariab-
len aus betrachtetes Modell der Softwareentwicklung. Nach diesem Modell ent-
hält die Softwareentwicklung vier Variablen:
K o s t e n
Z e i t
Q u a l i t ä t
 Umfang
Bei diesem Modell wird das Softwareentwicklungsspiel so gespielt, dass die Werte
von drei dieser Variablen von außen festgelegt werden dürfen. Das Entwick-
lungsteam darf den Wert der vierten Variablen bestimmen.
Einige Manager und Kunden glauben, Sie könnten den Wert aller vier Variablen
festlegen. »Alle gestellten Anforderungen werden von dem Team bis zum Ersten
des nächsten Monats erfüllt werden. Und da die Qualität bei uns oberste Priorität
hat, wird das Produkt unseren üblichen Standards entsprechen.« Wenn das der
Fall ist, leidet stets die Qualität darunter (was in der Regel den üblichen Stan-
dards entspricht), da niemand bei sehr hoher Belastung gute Arbeit leisten kann.
Es ist zudem wahrscheinlich, dass der Zeitrahmen nicht eingehalten wird. Die
Software wird dann zu spät fertig und taugt noch nicht einmal etwas.
Die Lösung besteht darin, diese Variablen sichtbar zu machen. Wenn alle Betei-
ligten – Programmierer, Kunden und Manager – alle vier Variablen vor Augen
haben, können sie sich bewusst entscheiden, welche Variablen sie festlegen wol-
len. Ist die sich daraus ergebende vierte Variable nicht akzeptabel, dann können
sie die Ausgangswerte ändern oder drei andere Variablen auswählen.
Abhängigkeiten zwischen den Variablen
Kosten –  G e l d  k a n n  e i n i g e s  i n  G a n g  b r i n g e n ,  a b e r  w e n n  z u  f r ü h  z u  v i e l  G e l d
investiert wird, kann dies mehr Probleme verursachen als lösen. Wenn anderer-
seits einem Projekt zu wenig Mittel zur Verfügung stehen, kann das Problem des
Kunden nicht gelöst werden.
--- PAGE 36 ---
16 4 Vier Variablen
Zeit – Durch eine l ängere Entwicklungszeit kann die Qualit ät gesteigert und der
Umfang vergrößert werden. Da Feedbacks von in Betrieb befindlichen Systemen
von sehr viel h öherer Qualität sind als alle anderen Arten von Feedbacks, leidet
ein Projekt darunter, wenn zu viel Zeit zur Verf ügung steht. Ist die Zeit f ür ein
Projekt zu knapp bemessen, wirkt sich dies vor allem auf die Qualit ät, aber
schließlich auch auf Umfang, Zeit und Kosten nachteilig aus.
Qualität – Qualität ist eine schreckliche Steuerungsvariable. Durch bewusste Qua-
litätsabstriche lassen sich kurzfristige Gewinne erzielen, allerdings sind die Kos-
ten hierfür (in menschlicher, geschäftlicher und technischer Hinsicht) enorm.
Umfang – Ein geringerer Umfang erm öglicht h öhere Qualit ät (solange die
geschäftlichen Anforderungen des Kunden noch erf üllt werden). Zudem kann
ein weniger umfangreiches Projekt schneller und billiger fertig gestellt werden.
Die Abhängigkeiten zwischen diesen Variablen sind komplex – es gibt keine ein-
fache direkte Beziehung. Beispielsweise erh ält man Software nicht einfach
dadurch in kürzester Zeit, dass man mehr Geld ausgibt.
In vielerlei Hinsicht unterliegt die Kostenvariable den meisten Einschränkungen.
Qualität oder Umfang oder kurze Entwicklungszeiten lassen sich nicht so einfach
erkaufen. Zu Projektbeginn sollte man überhaupt nicht viel ausgeben. Die Inves-
tition muss niedrig beginnen und mit der Zeit wachsen. Nach einer Weile kann
man entsprechend mehr Geld ausgeben.
Ich hatte einen Kunden, der meinte: »Wir haben zugesagt, diesen Funktionsum-
fang zu liefern. Dazu brauchen wir 40 Programmierer.«
Ich sagte zu ihm: »Sie können nicht vom ersten Tag an mit 40 Programmierern
arbeiten. Sie müssen mit einem einzigen Team beginnen. Sp äter stellen sie zwei
Teams ein und dann vier. In zwei Jahren k önnen Sie 40 Programmierer haben,
aber nicht heute.«
Der Kunde entgegnete: »Das verstehen Sie nicht. Wir brauchen einfach 40 Pro-
grammierer.« Ich antwortet darauf: »Sie können aber nicht mit 40 Programmie-
rern arbeiten.« Der Kunde sagte: »Wir müssen.«
Er musste nicht und tat es doch. Der Kunde stellte die 40 Programmierer ein. Das
Projekt ist nicht besonders gut gelaufen. Die Programmierer k ündigten; der
Kunde stellte 40 neue Programmierer ein. Vier Jahre sp äter begann das Projekt
langsam dem Unternehmen etwas einzubringen, indem man kleine Teilprojekte
fertig stellte; dabei wäre das Projekt anfangs fast eingestellt worden.
--- PAGE 37 ---
 Abhängigkeiten zwischen den Variablen 17
All die Kostenzw änge k önnen Manager verr ückt machen. Insbesondere wenn
Manager gehalten sind, ein Jahresbudget zu planen und zu überwachen, sind sie
so daran gew öhnt, alles unter dem Kostengesichtspunkt zu betrachten, dass sie
große Fehler begehen. Oft ignorieren sie die Zw änge, denen die Kostenkontrolle
unterliegt, und überschätzen deren Möglichkeiten.
Ein weiteres Problem besteht darin, dass höhere Kosten oft durch nicht zur Sache
gehörige Ziele wie Status oder Prestige bedingt sind. »Ich leite ein Projekt mit 150
Mitarbeitern (seufz, seufz).« Solche Projekte können scheitern, weil der Manager
beeindrucken will. Welchen Statusgewinn erzielt man auch dadurch, dass man
ein Projekt mit 10 Programmierern besetzt und es in der H älfte der Zeit fertig
stellt?
Andererseits sind die Kosten stark von den anderen Variablen abhängig. Im Rah-
men eines vernünftigen Investitionsbereichs lassen sich durch eine höhere Inves-
tition der Projektumfang vergr ößern oder der Spielraum der Programmierer
erweitern und somit die Qualit ät steigern oder die Entwicklungszeit bis zur
Marktreife (bis zu einem gewissen Maß) verkürzen.
Investitionen können auch Spannungen reduzieren – schnellere Rechner, mehr
technische Spezialisten, besser ausgestattete Büros.
Die Zwänge, denen die Projektsteuerung über die Variable Zeit unterliegt, sind
meist von au ßen bedingt – das Jahr 2000 stellt hierf ür das j üngste Beispiel dar.
Das Jahresende, der Quartalsbeginn, der geplante Termin, zu dem das alte System
abgeschaltet werden soll, eine große Messe – dies sind einige Beispiele für externe
Zeitzwänge. Die Variable Zeit liegt daher oft nicht im Entscheidungsbereich des
Projektmanagers, sondern in dem des Kunden.
Qualität ist eine weitere sonderbare Variable. Wenn man auf h öherer Qualität
besteht, werden Projekte h äufig schneller fertig oder es wird in einem bestimm-
ten Zeitraum mehr erledigt. Mir ist dies passiert, als ich Komponententests zu
schreiben begann (siehe die Anekdote am Anfang von Kapitel 2, »Eine Entwick-
lungsepisode«). Als ich meine Tests hatte, hatte ich viel mehr Vertrauen in mei-
nen Code, sodass ich schneller und unter weniger Anspannung programmieren
konnte. Ich konnte mein System einfacher debuggen, was die weitere Entwick-
lung erleichterte. Ich habe dies auch in Teams erlebt. Sobald das Team zu testen
beginnt oder sobald man sich auf Programmierstandards einigt, arbeitet das
Team schneller.
Zwischen der internen und der externen Qualit ät besteht eine etwas seltsame
Beziehung. Externe Qualität ist die Qualität, die vom Kunden gemessen wird. Mit
interner Qualität ist die Qualität gemeint, die von den Programmierern gemessen
--- PAGE 38 ---
18 4 Vier Variablen
wird. Zeitweilig auf interne Qualit ät zu verzichten, um das Produkt dadurch
schneller auf den Markt bringen zu k önnen, und zu hoffen, die externe Qualit ät
würde nicht allzu stark darunter leiden, ist sehr kurzfristig gedacht. Man kann
mit solch unsauberen Verfahren zwar oft über Wochen oder Monate hinweg
ungestraft davonkommen. Irgendwann werden die Probleme mit der internen
Qualität einen aber schließlich einholen und zur Folge haben, dass die Kosten für
die Softwarewartung unerschwinglich hoch werden und dass das geforderte Maß
an externer Qualität nicht erreicht werden kann.
Andererseits kann man gelegentlich ein Projekt schneller abschlie ßen, wenn
man die Qualitätsanforderungen lockert. Ich habe einmal an einem System gear-
beitet, das ein COBOL-System ersetzen sollte. Unsere Qualit ätsanforderung war,
dass wir die L ösungen, die das alte System bot, genau reproduzieren sollten. Als
der Liefertermin n äher rückte, wurde es offensichtlich, dass wir das alte System
inklusive seiner Fehler reproduzieren konnten, allerdings zu einem viel sp äteren
Liefertermin. Wir wendeten uns an den Kunden, zeigten, dass unsere L ösungen
korrekter waren, und boten ihm an, p ünktlich zu liefern, wenn er unseren
Lösungen statt der alten vertraute.
Qualität wirkt sich auch auf die Psychologie der Mitarbeiter aus. Jeder m öchte
gute Arbeit leisten und man arbeitet viel besser, wenn man das Gef ühl hat, an
etwas Gutem zu arbeiten. Wenn man der Qualität bewusst einen geringeren Stel-
lenwert einräumt, mag das Team anfangs schneller Ergebnisse liefern, aber der
demoralisierende Effekt, den das Produzieren mangelhafter Produkte hat, wird
bald den Vorsprung einholen, den man dadurch gewonnen hat, dass man nicht
testet oder nicht bewertet oder sich nicht an Standards hält.
Auf den Umfang konzentrieren
Eine Menge Leute kennen die Variablen Kosten, Qualit ät und Zeit, sind sich der
vierten Variable allerdings nicht bewusst. In der Softwareentwicklung ist der
Umfang die wichtigste zu ber ücksichtigende Kontrollvariable. Weder die Pro-
grammierer noch die Betriebswirte haben mehr als eine vage Vorstellung davon,
was den Wert der in Entwicklung befindlichen Software ausmacht. Eine der
wichtigsten Entscheidungen des Projektmanagements besteht in der Beschnei-
dung des Umfangs. Wenn Sie den Umfang gezielt kontrollieren, k önnen Sie
Managern und Kunden Kontrolle über Kosten, Qualität und Zeit geben.
Einer der Vorteile der Variable Umfang besteht darin, dass sie in hohem Ma ße
veränderlich ist. Seit Jahrzehnten jammern die Programmierer bereits: »Die Kun-
den können uns nicht sagen, was sie wollen. Wir liefern ihnen das, was sie nach
ihrer Aussage angeblich wollen, und dann m ögen sie es nicht.« Dies ist eine der
--- PAGE 39 ---
 Auf den Umfang konzentrieren 19
unumstößlichen Tatsachen der Softwareentwicklung. Die Anforderungen sind
anfangs nie klar. Die Kunden k önnen nicht klar zum Ausdruck bringen, was
genau sie wollen.
Die Entwicklung einer Softwarekomponente ändert ihre Anforderungen. Sobald
die Kunden die erste Version sehen, finden sie heraus, was sie in der zweiten Ver-
sion wollen – oder was sie eigentlich schon in der ersten Version h ätten haben
wollen. Dieser Lernprozess ist wertvoll und w äre aufgrund bloßer Spekulationen
nicht möglich gewesen. Und er ist nur auf Grund von Erfahrungen möglich. Die
Kunden können diese Erfahrung aber nicht für sich allein machen. Sie brauchen
Leute, die programmieren können, und zwar als Begleiter, nicht als Führer.
Wie wäre es, wenn wir die »Schwammigkeit« von Anforderungen als Möglichkeit
und nicht als Problem betrachten? Wir k önnen den Umfang dann als die Vari-
able sehen, die am einfachsten zu steuern ist. Da der Umfang so schwammig ist,
können wir ihn formen – ein bisschen in diese Richtung und etwas in jene.
Wenn die Zeit vor dem Liefertermin knapp wird, findet sich immer ein bisschen,
was sich für die nächste Version aufschieben lässt. Indem wir versuchen, nicht zu
viel zu tun, bleiben wir in der Lage, die geforderte Qualität pünktlich zu liefern.
Würden wir, basierend auf diesem Modell, eine Methode der Softwareentwick-
lung schaffen, dann w ürden wir den Termin, die Qualit ät und die Kosten einer
Softwarekomponente fix halten. Wir w ürden uns den Umfang ansehen, der
durch die erstgenannten drei Variablen impliziert wird. Im weiteren Verlauf der
Entwicklung w ürden wir dann den Umfang fortw ährend an die gegebenen
Bedingungen anpassen.
Es müsste sich um einen Prozess handeln, der Änderungen toleriert, da das Pro-
jekt häufig seine Richtung ändern würde. Man möchte nicht viel Geld f ür Soft-
ware ausgeben, die schlussendlich nicht verwendet wird. Sie m öchten ja auch
keine Straße bauen, auf der Sie nie fahren werden, da Sie doch einen anderen
Weg eingeschlagen haben. Es müsste sich zudem um einen Prozess handeln, der
die Kosten für Änderungen während der Lebensdauer des Systems gering hält.
Wenn man kurz vor jedem Liefertermin einer Version wichtige Funktionen weg-
lässt, dann wird der Kunde bald ver ärgert sein. Um dies zu vermeiden, setzt XP
zwei Strategien ein:
1. Es bringt viel, wenn man Aufwandssch ätzungen macht und Feedbacks zu den
tatsächlichen Ergebnissen erh ält. Bessere Aufwandssch ätzungen verringern
die Wahrscheinlichkeit, dass man Funktionen weglassen muss.
2. Man implementiert die wichtigsten Anforderungen des Kunden zuerst, sodass
es die weniger wichtigen trifft, wenn man möglicherweise Funktionen weglas-
sen muss.
--- PAGE 41 ---
5 Kosten von Änderungen
Unter bestimmten Umständen kann der im Laufe der Zeit exponentielle Anstieg der Kos-
ten für Softwareänderungen abgeflacht werden. Wenn wir aber die Kurve abflachen
können, dann sind bislang bestehende Annahmen über das beste Verfahren der Soft-
wareentwicklung nicht mehr wahr.
Eine der allgemeinen Annahmen der Softwareentwicklung lautet, dass die Kosten
für die Änderung eines Programms mit der Zeit exponentiell steigen. Ich erinnere
mich daran, wie ich in einem mit Linoleum ausgelegten Hörsaal sitze und
zuschaue, wie der Professor das in Abbildung 5.1 dargestellte Diagramm zeich-
net.
»Die Kosten für die Behebung eines Problems in einer Softwarekomponente stei-
gen mit der Zeit exponentiell an. Ein Problem, dessen Lösung eine Mark gekostet
hätte, wenn Sie es während der Anforderungsanalyse gefunden hätten, kann tau-
sende von Mark kosten, wenn die Software erst einmal in Produktion gegangen
ist.«
Ich beschloss damals natürlich, dass ich niemals ein Problem bis zur Produktion
stehen lassen würde. Ich würde Probleme auf jeden Fall so bald als möglich
abfangen. Ich würde jedes mögliche Problem im Vorhinein lösen. Ich würde mei-
nen Code prüfen und nochmals prüfen. Ich würde meinen Arbeitgeber keines-
falls 100.000 Mark kosten.
Abbildung 5.1  Die Kosten von Änderungen steigen mit der Zeit exponentiell an.
--- PAGE 42 ---
22 5 Kosten von Änderungen
Nun, diese Kurve ist nicht mehr gültig. Durch die Kombination von Technologie
und Programmierverfahren ist es sogar möglich, eine fast umgekehrt verlaufende
Kurve zu erzeugen. Heute sind Geschichten wie die Folgende m öglich, die mir
kürzlich bei einem System zur Verwaltung von Lebensversicherungsvertr ägen
passiert ist:
17:00 Uhr: Ich entdecke, dass – so weit ich es beurteilen kann – die wunderbare
Funktion unseres Systems, mit der in einer einzigen Transaktion Lastschriften
von mehreren Konten und Gutschriften auf mehrere Konten verarbeitet werden
können, einfach nicht verwendet wird. Jede Transaktion geht von einem Konto
aus und wird an einem anderen Konto ausgeführt. Ist es möglich, das System wie
in Abbildung 5.2 dargestellt zu vereinfachen?
17:02 Uhr: Ich bitte Massismo, zu mir her überzukommen und mit mir zusam-
men die Situation zu analysieren. Wir schreiben eine Abfrage. Jede der 300.000
im System verzeichneten Transaktionen hat ein einziges Lastschriftkonto und
ein einziges Gutschriftkonto.
17:05 Uhr: Wie müssten wir vorgehen, wenn wir diesen Fehler beheben wollten?
Wir würden die Schnittstelle des Transaktionsmoduls namens Transaction und
deren Implementierung ändern. Wir schreiben die erforderlichen vier Methoden
und beginnen mit den Tests.
17:15 Uhr: Die Tests (mehr als 1000 Komponenten- und Funktionstests) funktio-
nieren immer noch zu 100%. Wir k önnen uns nicht vorstellen, warum diese
Änderungen nicht funktionieren sollten. Wir fangen an, den Code zur Daten-
bankmigration zu schreiben.
17:20 Uhr:  Die Batch-Dateien sind fertig und die Datenbank wurde gesichert.
Wir installieren die neue Codeversion und führen die Migration aus.
Abbildung 5.2  Kann man für Lastschriften und Gutschriften jeweils eine eigene Komponente 
implementieren?
--- PAGE 43 ---
5 Kosten von Änderungen 23
17:30 Uhr: Wir führen einige Plausibilitätstests durch. Alles funktioniert. Nach-
dem uns nichts einfällt, was wir sonst noch testen oder tun k önnten, gehen wir
nach Hause.
Nächster Tag: Die Fehlerprotokolle sind leer. Es liegen keine Beschwerden von
den Benutzern vor. Die Änderung hat geklappt.
In den n ächsten Wochen entdeckten wir eine Reihe von Dingen, die sich auf
Grund der neuen Struktur vereinfachen lie ßen. Diese erm öglichte es uns, den
Buchhaltungsteil des Systems für eine völlig neue Funktionalität zu öffnen, wäh-
rend wir das System gleichzeitig einfacher, verst ändlicher und weniger redun-
dant gestalteten.
Was w ürden wir tun, wenn sich diese Investition lohnen w ürde? Was w äre,
wenn sich die Arbeit an Sprachen und Datenbanken und all den anderen Dingen
wirklich ausgezahlt hätte? Was wäre, wenn die Kosten von Änderungen mit der
Zeit nicht exponentiell anstiegen, sondern sehr viel langsamer w üchsen und
schließlich eine Asymptote erreichten? Was w äre, wenn die Informatikprofesso-
ren von morgen eine Kurve wie in Abbildung 5.3 an die Tafel zeichnen würden?
Dies ist eine der Prämissen von XP. Es ist die technische Prämisse von XP. Wenn
die Kosten von Änderungen mit der Zeit langsam steigen, verh ält man sich voll-
kommen anders als unter der Annahme eines exponentiellen Kostenanstiegs. Sie
würden wichtige Entscheidungen so sp ät wie m öglich im Entwicklungsprozess
treffen, um die Kosten aufzuschieben, die durch diese Entscheidungen bedingt
sind, und um die Wahrscheinlichkeit zu erh öhen, dass die richtigen Entschei-
dungen getroffen werden. Sie w ürden nur das implementieren, was unbedingt
nötig ist, in der Hoffnung, dass sich Ihre Befürchtungen hinsichtlich der morgen
zu erf üllenden Anforderungen nicht bewahrheiten. Sie w ürden Elemente nur
dann in das Design einbringen, wenn diese den vorhandenen Code oder die Pro-
grammierung des nächsten Codemoduls vereinfachten.
Abbildung 5.3  Vielleicht steigen ja die Kosten von Änderungen nicht mit der Zeit stark an.
--- PAGE 44 ---
24 5 Kosten von Änderungen
Wenn eine abgeflachte Änderungskostenkurve XP ermöglicht, dann macht eine
steile Änderungskostenkurve XP unmöglich. Falls Änderungen ruinös teuer sind,
dann w äre man verr ückt, w ürde man einfach drauflosarbeiten, statt sorgf ältig
vorauszuplanen. Wenn Änderungen jedoch erschwinglich sind, dann gleichen
der höhere Wert und die Risikominderung von konkreten Feedbacks die zusätzli-
chen Kosten von frühen Änderungen aus.
Es ist keine Zauberei, Kosten gering zu halten. Es gibt Technologien und Verfah-
ren, die die Software änderbar halten.
Auf der technologischen Seite sind Objekte die Schlüsseltechnologie. Das Senden
von Nachrichten stellt ein leistungsf ähiges Verfahren dar, kosteng ünstig viele
Möglichkeiten für Änderungen zur Verfügung zu stellen. Jede Nachricht wird zu
einem potenziellen Ansatzpunkt f ür künftige Modifikationen, und zwar Modifi-
kationen, die keine Änderungen am vorhandenen Code erfordern.
Objektorientierte Datenbanken machen diese Flexibilit ät im Bereich permanen-
ter Datenspeicher möglich. Mit einer Objektdatenbank kann man in einem For-
mat vorliegende Objekte mühelos in ein anderes Format überführen, da der Code
mit den Daten verkn üpft ist und nicht wie in fr üheren Datenbanktechnologien
davon getrennt ist. Auch wenn sich die Objekte nicht migrieren lassen, k önnen
zwei alternative Implementierungen gleichberechtigt nebeneinander bestehen.
Das soll nicht hei ßen, dass diese Flexibilit ät nur mithilfe von Objekten m öglich
ist. Ich habe die Grundlagen von XP gelernt, indem ich zusah, wie mein Vater
Code für die Echtzeitprozesskontrolle in Assembler schrieb. Er hatte dabei einen
Stil entwickelt, der es ihm erm öglichte, das Design seiner Programme fortw äh-
rend zu verbessern. Meiner Erfahrung nach steigen die Kosten von Änderungen
jedoch stärker an, wenn man nicht mit Objekten arbeitet.
Objekte sind aber noch nicht alles. Ich habe eine Unmenge objektorientierten
Codes gesehen (und wahrscheinlich auch geschrieben, um der Wahrheit die Ehre
zu geben), den niemand anfassen wollen würde.
Verschiedene Faktoren ergeben sich daraus, was unseren Code einfach zu ändern
machte, auch Jahre, nachdem er in Produktion gegangen ist:
 Ein einfaches Design ohne zusätzliche Designelemente – Keine Ideen, die bis-
lang noch nicht eingesetzt worden sind und von denen nichts als die Vorstel-
lung bestand, dass sie in der Zukunft verwendet würden.
 Automatisierte Tests, die uns das Vertrauen gaben, wir w ürden es sofort
bemerken, wenn wir unbeabsichtigt das Verhalten des vorhandenen Systems
ändern würden.
 Eine Menge Übung im Ändern des Designs, sodass wir keine Scheu hatten,
Änderungen zu versuchen, wenn es an der Zeit war, das System zu ändern.
--- PAGE 45 ---
5 Kosten von Änderungen 25
Nachdem diese Elemente gegeben waren (einfaches Design, Tests und die Bereit-
schaft zur st ändigen Verfeinerung des Designs), konnten wir die in Abbildung
5.3 dargestellte abgeflachte Kurve feststellen. Eine Änderung, die am Anfang der
Programmentwicklung nur einige Minuten gedauert hätte, nahm 30 Minuten in
Anspruch, nachdem das System bereits seit zwei Jahren in Betrieb war. Ich kenne
Projekte, in denen man Tage oder Wochen damit verbringt, diese Art von Ent-
scheidung zu treffen, statt heute das Erforderliche zu erledigen und darauf zu set-
zen, gegebenenfalls morgen Änderungen daran vornehmen zu können.
Diese neue Annahme hinsichtlich der Änderungskosten bringt die Gelegenheit
mit sich, mit einem v öllig anderen Ansatz an die Softwareentwicklung heranzu-
gehen. Dieser Ansatz ist genauso strikt wie andere Ansätze, aber er ist an anderen
Größen ausgerichtet. Statt darauf bedacht zu sein, einschneidende Entscheidun-
gen früh und weniger wichtige Entscheidungen sp äter zu treffen, entwerfen wir
einen Ansatz der Softwareentwicklung, bei dem jede Entscheidung zwar rasch
gefällt, aber auch durch automatisierte Tests abgesichert wird, und der Sie darauf
vorbereitet, das Design der Software dann zu verbessern, wenn Sie das auch k ön-
nen.
Es wird allerdings nicht ganz einfach sein, einen solchen Ansatz zu entwickeln.
Wir müssen unsere Grundannahmen über das, was eine gute Softwareentwick-
lung ausmacht, erneut überprüfen. Wir können den Weg schrittweise vollziehen.
Wir beginnen mit einer Geschichte, einer Geschichte, die die Grundlage für alles
Weitere bildet.
--- PAGE 47 ---
6 Fahren lernen
Wir müssen die Softwareentwicklung steuern, indem wir viele kleine Änderungen vor-
nehmen und nicht einige wenige große. Dies bedeutet, dass wir ein Feedback brauchen,
um zu wissen, wann wir von der Bahn abgekommen sind. Uns muss immer wieder die
Gelegenheit gegeben sein, Korrekturen vorzunehmen und dies zu möglichst geringen
Kosten.
Wir haben jetzt das allgemeine Problem umrissen – die enormen Kosten von
Änderungen und die Möglichkeit, dieses Risiko durch Optionen handzuhaben –
und die Ressource, die zu dessen Lösung erforderlich ist: die Freiheit, Änderun-
gen in einem späteren Entwicklungsstadium vornehmen zu können, ohne
dadurch immense Kosten zu verursachen. Kommen wir nun zu der Lösung. Zual-
lererst brauchen wir eine Metapher, eine gemeinsame Geschichte, die wir uns in
Stresssituationen oder vor Entscheidungen in Erinnerung rufen können und die
uns hilft, das Richtige zu tun.
Ich kann mich deutlich an den Tag erinnern, an dem ich meine erste Fahrstunde
hatte. Meine Mutter und ich fuhren auf der Interstate 5 nahe Chico, Kalifornien,
gen Norden, auf einem geraden, ebenen Abschnitt, auf dem sich die Straße bis
zum Horizont zu erstrecken schien. Meine Mutter ließ mich von der Beifahrer-
seite aus das Lenkrad halten. Sie vermittelte mir ein Gefühl dafür, wie sich die
Bewegung des Lenkrads auf die Richtung des Autos auswirkte. Dann sagt sie zu
mir: »So fährt man Auto. Richte das Auto an der Mittellinie aus und fahre in der
Mitte der Fahrbahn direkt auf den Horizont zu.«
Ich blickte konzentriert auf die Straße. Es gelang mir, das Auto in die Mitte der
Fahrbahn zu bringen, sodass es sich mitten auf der Straße befand und geradeaus
fuhr. Soweit machte ich das ganz gut. Dann schweiften meine Gedanken etwas
ab ...
Ich erschrak und war sofort hellwach, als das Auto den Schotter am Straßenrand
streifte. Meine Mutter (deren Mut mich heute erstaunt) lenkte das Auto sanft
zurück auf die Fahrbahn. Dann brachte sie mir Folgendes über das Autofahren
bei: »Beim Autofahren ist es nicht damit getan, das Auto in die richtige Richtung
zu lenken. Vielmehr kommt es darauf an, ständig aufzupassen und einmal zu die-
ser und dann zu jener Seite hin kleine Korrekturen vorzunehmen.«
Dies ist das Paradigma von XP. Hier haben die Begriffe gerade und eben keine
Bedeutung. Auch wenn ein Projekt perfekt abzulaufen scheint, behält man die
Straße im Auge. Die einzige Konstante ist die Kurskorrektur. Sie müssen stets
--- PAGE 48 ---
28 6 Fahren lernen
darauf gefasst sein, sich etwas in diese Richtung oder in jene Richtung zu bewe-
gen. Gelegentlich müssen Sie unter Umständen eine völlig andere Richtung ein-
schlagen. So ist das Leben eines Programmierers eben.
Alles an der Software ändert sich. Die Anforderungen ändern sich. Das Design
ändert sich. Das Gesch äft ändert sich. Die Technologie ändert sich. Das Team
ändert sich. Die Teammitglieder ändern sich. Das Problem besteht nicht in der
Änderung an sich, da Änderungen unvermeidlich sind. Das Problem besteht viel-
mehr in der Unf ähigkeit, mit notwendigen Änderungen angemessen umzuge-
hen.
Der Kunde ist gleichsam der Fahrer eines Softwareprojekts. Wenn die Software
nicht das leistet, was der Kunde von ihr erwartet, dann haben Sie versagt. Nat ür-
lich weiß der Kunde nicht genau, was die Software leisten soll. Aus diesem Grund
gleicht die Softwareentwicklung dem Autofahren, da es auch hier nicht aus-
reicht, den Wagen in eine bestimmte Richtung zu bringen. Unsere Aufgabe als
Programmierer besteht darin, dem Kunden ein Lenkrad und ständig ein Feedback
über unsere genaue Position zu geben.
Die Autofahrgeschichte hat auch eine Moral f ür den XP-Prozess selbst. Die vier
Werte – Kommunikation, Einfachheit, Feedback und Mut –, die im n ächsten
Kapitel beschrieben werden, geben Aufschluss dar über, welches Gefühl man bei
der Softwareentwicklung haben sollte. Auf welche Weise Sie dieses Gef ühl erlan-
gen, wird sich jedoch von Ort zu Ort und von Situation zu Situation und von
Person zu Person unterscheiden. W ährend eines Entwicklungsprozesses k önnen
Sie sich eine Reihe einfacher Techniken aneignen, die Ihnen das gew ünschte
Gefühl vermitteln. Im weiteren Verlauf der Entwicklung werden Sie dann mer-
ken, welche Techniken Sie auf das Ziel hinf ühren und welche Sie davon ablen-
ken. Jede Technik ist ein Experiment, das so lange G ültigkeit hat, bis seine
Untauglichkeit bewiesen wurde.
--- PAGE 49 ---
7 Vier Werte
Wir sind dann erfolgreich, wenn unser Stil von bestimmten, gleichbleibenden Werten
zeugt, die sowohl menschlichen als auch geschäftlichen Belangen dienen: Kommunika-
tion, Einfachheit, Feedback und Mut.
Bevor wir die Geschichte vom Fahrunterricht auf eine Reihe von Verfahren zur
Softwareentwicklung reduzieren können, brauchen wir einige Kriterien, an
denen sich ablesen lässt, ob wir uns in die richtige Richtung bewegen. Es wäre
sinnlos, einen neuen Programmierstil zu erfinden und dann zu entdecken, dass
er uns nicht gefällt oder dass er nicht funktioniert.
Die kurzfristigen Ziele von einzelnen Leuten stehen oft im Widerspruch zu den
langfristigen Zielen der Gemeinschaft. Gesellschaften haben gelernt, mit diesem
Problem umzugehen, indem sie gemeinsame Wertvorstellungen entwickelt
haben, die durch Mythen, Rituale, Strafen und Belohnungen gestützt werden.
Fehlen diese Werte, tendieren die Menschen dazu, sich nur um ihre eigenen,
kurzfristigen Interessen zu kümmern.
Die vier Werte von XP sind:
 Kommunikation
 Einfachheit
 Feedback
M u t
Kommunikation
Der erste XP-Wert ist Kommunikation. Probleme in Projekten lassen sich stets
darauf zurückführen, dass jemand etwas Wichtiges nicht mit den anderen
bespricht. Manchmal teilen Programmierer anderen nichts von einer wichtigen
Designänderung mit. Manchmal stellen Programmierer den Kunden nicht die
richtigen Fragen, sodass eine wichtige Entscheidung falsch ausfällt. Manchmal
stellen Manager den Programmierern nicht die richtigen Fragen und erhalten
nicht die richtigen Informationen über den Projektstatus.
Mangelhafte Kommunikation ist kein Zufall. Viele Umstände tragen zum Schei-
tern von Kommunikation bei. Ein Programmierer überbringt dem Manager eine
schlechte Nachricht und wird dafür bestraft. Ein Kunde teilt dem Programmierer
etwas Wichtiges mit und der Programmierer scheint diese Information zu igno-
rieren.
--- PAGE 50 ---
30 7 Vier Werte
XP zielt darauf ab, den Kommunikationsfluss aufrechtzuerhalten, indem viele
Verfahren angewandt werden, die Kommunikation erfordern. Dabei handelt es
sich beispielsweise um Komponententests, Programmieren in Paaren und Auf-
wandschätzung von Aufgaben, die kurzfristig sinnvoll sind. Tests, Programmie-
ren in Paaren und Aufwandsch ätzung haben den Effekt, dass Programmierer,
Kunden und Manager miteinander kommunizieren müssen.
Das heißt allerdings nicht, dass die Kommunikation in XP-Projekten nicht gele-
gentlich gest ört sein kann. Leute bekommen Angst, machen Fehler, werden
abgelenkt. XP setzt einen Coach ein, dessen Aufgabe darin besteht, Kommunika-
tionsprobleme zu entdecken und die Kommunikation wieder in Gang zu brin-
gen.
Einfachheit
Der zweite XP-Wert ist Einfachheit. Der XP-Coach fragt das Team: »Wie sieht die
einfachste Lösung aus?« (»What is the simplest thing that could possibly work?«)
Einfachheit ist nicht leicht zu erreichen. Es ist unheimlich schwer, sich nicht mit
den Dingen zu besch äftigen, die man morgen oder n ächste Woche oder n ächs-
ten Monat implementieren muss. Zwanghaftes Vorausdenken bedeutet jedoch,
dass man der Angst vor dem exponentiellen Anstieg der Kosten von Änderungen
nachgibt. Gelegentlich muss der Trainer die Mannschaft vorsichtig darauf auf-
merksam machen, dass sie ihren eigenen Ängsten gehorcht. »Vielleicht sind Sie
ja viel klüger als ich und bekommen diesen komplizierten, sich dynamisch aus-
gleichenden Baumalgorithmus hin. Aber kann es nicht sein, dass auch eine line-
are Suche funktioniert.«
Greg Hutchinson schreibt:
Einer meiner Auftraggeber, für den ich als Berater arbeitete, entschied, wir bräuchten ein
allgemeines Dialogfeld zur Textanzeige. (Es ist ja nicht so, als h ätten wir nicht schon
genug davon, aber ich will nicht abschweifen.) Wir sprachen über die Schnittstelle f ür
dieses Dialogfeld und wie sie funktionieren sollte. Der Programmierer entschied, dass
das Dialogfeld relativ intelligent sein sollte und seine Größe und die Anzahl der Zeilen-
umbrüche im Text basierend auf der Schriftgr öße und anderen Variablen festlegen
sollte. Ich fragte meinen Auftraggeber, wie viele Programmierer diese Komponente der-
zeit bräuchten. Der Programmierer war die einzige Person, die sie brauchte. Ich schlug
vor, dass wir das Dialogfeld nicht ganz so intelligent, sondern f ür seine Zwecke gerade
ausreichend gestalten sollten (20 Minuten Arbeit). Wir w ürden die Klasse und die
Schnittstelle offen legen und k önnten das Dialogfeld dann immer noch intelligenter
machen, wenn dies erforderlich werden w ürde. Ich konnte den Programmierer nicht
--- PAGE 51 ---
 Feedback 31
überzeugen und es wurden zwei Tage mit dem Programmieren dieses Codes zugebracht.
Am dritten Tag hatten sich die Anforderungen ge ändert und man brauchte dieses Dia-
logfeld nicht mehr. Man hatte zwei Manntage in einem Projekt vergeudet, das ohnehin
schon unter Termindruck stand. Lassen Sie es mich bitte wissen, wenn Sie diesen Code
jemals verwenden möchten. (Quelle: E-Mail)
XP gleicht einer Wette. Man wettet darauf, dass es besser ist, heute etwas Einfa-
ches zu tun und morgen etwas mehr zu zahlen, wenn man es ändern muss, statt
heute etwas Komplizierteres zu tun, das vielleicht niemals eingesetzt wird.
Zwischen Einfachheit und Kommunikation besteht eine wunderbare, sich wech-
selseitig verst ärkende Beziehung. Je mehr man kommuniziert, desto klarer
erkennt man, was wirklich getan werden muss, und desto mehr Vertrauen hat
man in sein Urteil, was nicht getan werden muss. Je einfacher ein System ist,
desto weniger muss darüber mitgeteilt werden, was zu einer umfassenderen Kom-
munikation führt. Das gilt insbesondere, wenn das System so weit vereinfacht
werden kann, dass weniger Programmierer benötigt werden.
Feedback
Der dritte XP-Wert ist das Feedback. Typische Trainers ätze dazu lauten: »Fragen
Sie nicht mich, fragen Sie das System. « »Haben Sie daf ür bereits den Testfall
geschrieben?« Ein konkretes Feedback über den aktuellen Status des Systems ist
absolut unbezahlbar. Optimismus ist eine Berufskrankheit von Programmierern,
die nur durch Feedback zu behandeln ist.
Feedbacks werden zu verschiedenen Zeiten eingesetzt. Zuerst werden Feedbacks
über einen Zeitraum von Minuten oder Tagen gesammelt. Die Programmierer
schreiben Komponententests f ür alle logischen Komponenten des Systems, die
möglicherweise nicht funktionieren. Die Programmierer erhalten dadurch
Minute f ür Minute konkrete Feedbacks über den Zustand des Systems. Wenn
Kunden neue Storycards (Beschreibungen von Leistungsmerkmalen) schreiben,
schätzen die Programmierer sofort den daf ür erforderlichen Aufwand ein, damit
die Kunden ein konkretes Feedback über die Qualit ät ihrer Storycard erhalten.
Derjenige, der den Arbeitsfortschritt überwacht, verzeichnet, wann Aufgaben
erledigt wurden, und gibt dem gesamten Team ein Feedback dar über, wie wahr-
scheinlich es ist, dass in dem geplanten Zeitraum all das erledigt werden kann,
was man sich vorgenommen hat.
Feedbacks lassen sich auch über Wochen oder Monate hinweg sammeln. Der
Kunde und Tester schreiben Funktionstests f ür s ämtliche Leistungsmerkmale
(»vereinfachte Anwendungsfälle«), die im System implementiert sind. Sie erhal-
ten konkrete Feedbacks über den aktuellen Zustand ihres Systems. Die Kunden
--- PAGE 52 ---
32 7 Vier Werte
überprüfen den Terminplan alle zwei oder drei Wochen, um zu sehen, ob die all-
gemeine Geschwindigkeit des Teams dem Plan entspricht, und um den Plan
gegebenenfalls anzupassen. Das System geht in Produktion, sobald dies sinnvoll
erscheint, sodass das Unternehmen einen Eindruck davon erhält, wie das System
in Aktion aussieht, und überlegt werden kann, wie es sich am besten nutzen
lässt.
Die fr ühe Inbetriebnahme oder Produktion muss n äher erl äutert werden. Eine
der Strategien im Planungsprozess besteht darin, dass das Team so früh wie mög-
lich die wichtigsten Merkmale in das System einbaut. Die Programmierer erhal-
ten damit ein konkretes Feedback über die Qualit ät ihrer Entscheidungen und
den Entwicklungsprozess, das nur möglich ist, wenn das ganze System in Betrieb
ist. Einige Programmierer haben noch nie mit einem in Produktion befindlichen
System gearbeitet. Wie sollen sie unter solchen Umst änden auf Dauer bessere
Arbeit leisten?
Die meisten Projekte scheinen die genau entgegengesetzte Strategie zu verfolgen.
Anscheinend unterstellt man Folgendes: »Wenn das System einmal in Produk-
tion gegangen ist, dann k önnen wir keine ‚interessanten’ Änderungen mehr
daran vornehmen und daher behalten wir das System möglichst lange in der Ent-
wicklung.«
Das ist der verkehrte Ansatz. Die Entwicklung ist ein temporärer Zustand, in dem
das System nur einen kleinen Teil seiner gesamten Lebensdauer verbringt. Es ist
viel besser, dem System ein eigenständiges Leben zu geben, es für sich allein ste-
hen und atmen zu lassen. Sie m üssen sich darauf gefasst machen, gleichzeitig
den laufenden Betrieb zu unterstützen und neue Funktionalität zu entwickeln. Es
ist besser, man gew öhnt sich fr üh daran, Produktion und Entwicklung handzu-
haben.
Konkrete Feedbacks erg änzen Kommunikation und Einfachheit. Je mehr Feed-
backs Sie erhalten, desto einfacher ist es, zu kommunizieren. Wenn jemand Ein-
wände gegen eine von Ihnen geschriebene Komponente hat und Ihnen einen
Testfall überreicht, der einen Fehler der Komponente aufdeckt, dann hat dies
mehr Wert als stundenlange Diskussionen über die Ästhetik des Designs. Wenn
Sie offen miteinander kommunizieren, werden Sie in Erfahrung bringen, was Sie
testen und messen müssen, um mehr über das System zu erfahren. Einfache Sys-
teme sind einfacher zu testen. Das Schreiben von Tests kann Ihren Blick daf ür
schärfen, wie einfach das System sein kann – Sie sind erst dann fertig, wenn
sämtliche Tests fehlerfrei ausgeführt werden.
--- PAGE 53 ---
 Mut 33
Mut
Was die ersten drei Werte betrifft (Kommunikation, Einfachheit und Feedback),
ist es angeraten, möglichst schnell zu arbeiten. Wenn Sie nicht Gas geben, dann
tut es ein anderer und derjenige wird auch Ihren Gewinn einstreichen.
Es folgt eine Geschichte über Mut in der Praxis. Mitten in Iteration 8 eines zehn
Iterationen umfassenden Entwicklungsplans (in Woche 25 von 30) der ersten
Version eines umfangreichen XP-Projekts entdeckte das Team eine grundlegende
Schwäche in der Architektur. Die Ergebnisse der Funktionstests waren zun ächst
befriedigend, sind dann aber unter ein Niveau abgefallen, das bei weitem nicht
den Erwartungen entsprach. Durch die Behebung eines Defekts wurde ein ande-
rer verursacht. Das Problem lag in einer mangelhaften Architektur begründet.
(Den Neugierigen unter Ihnen sei verraten, dass das System Gehaltsabrechnun-
gen erstellte. Anspr üche repräsentierten dasjenige, was die Firma den Mitarbei-
tern schuldete. Abz üge repräsentierten wiederum dasjenige, was die Mitarbeiter
anderen schuldeten. Einige Leute hatten negative Anspr üche statt positiver
Abzüge.)
Das Team hat genau das Richtige getan. Als es erkannte, dass es nicht mehr wei-
terging, hat es den Mangel behoben. Das hatte zur Folge, dass auf einen Schlag
etwa die Hälfte der Tests ungültig war, die eingesetzt worden waren. Einige Tage
konzentrierter Arbeit später sahen die Testergebnisse jedoch wieder nach einem
baldigen Projektabschluss aus. Dazu gehörte Mut.
Eine andere mutige Tat besteht darin, Code wegzuwerfen. Wissen Sie, wie es ist,
wenn man den ganzen Tag an etwas arbeitet, es nicht besonders gut l äuft und
der Rechner st ändig abstürzt? Und am n ächsten Tag kommen Sie ins B üro und
leisten in einer halben Stunde die gesamte Arbeit des vorherigen Tages und dies-
mal funktioniert alles einwandfrei.
Beherzigen Sie den folgenden Rat. Wenn der Tag zu Ende geht und der Code
außer Kontrolle gerät, dann werfen Sie ihn einfach weg. Sie k önnen die Testfälle
aufbewahren, wenn Sie die von Ihnen entworfene Schnittstelle gut finden, k ön-
nen dies aber auch unterlassen. Vielleicht beginnen Sie einfach noch einmal
ganz von vorne.
Vielleicht haben Sie aber auch drei Designalternativen. Programmieren Sie einen
Tag lang f ür jede Alternative, um ein Gef ühl für deren Tauglichkeit zu bekom-
men. Werfen Sie den Code weg und beginnen Sie erneut mit dem Design, das am
vielversprechendsten zu sein schien.
--- PAGE 54 ---
34 7 Vier Werte
Die Designstrategien von XP ähneln einem Algorithmus für eine Bergbesteigung.
Sie fangen mit einem einfachen Design an, machen es etwas komplizierter, dann
wieder etwas einfacher, dann wieder etwas komplizierter. Schwierig ist es hier,
den in einem bestimmten Kontext optimalen Punkt zu finden, an dem sich die
Situation nicht durch kleine Änderungen, sondern nur durch eine umfangreiche
Änderung verbessern lässt.
Was, wenn man sich beim Programmieren in eine Sackgasse manövriert hat? Mut.
Irgendwann kommt immer jemand im Team auf eine verrückte Idee, die die ganze
Komplexität des Systems entschärfen kann. Wenn das Team mutig ist, probiert es
die Idee aus. Und das funktioniert (manchmal). Wenn das Team Mut hat, nimmt
es dieses System in Betrieb. Damit begibt man sich auf einen völlig neuen Weg.
Wenn die ersten drei Werte nicht gegeben sind, dann ist Mut einfach nur
»Hacken« (hier abwertend gemeint). In der Kombination mit Kommunikation,
Einfachheit und Feedback ist Mut unschätzbar.
Kommunikation f ördert Mut, da damit M öglichkeiten f ür risikoreichere, loh-
nenswerte Experimente eröffnet werden. »Dir gefällt das nicht? Ich hasse diesen
Code. Lass uns einmal ausprobieren, wie viel wir davon in einem Nachmittag
ersetzen können.« Einfachheit fördert Mut, da man viel mutiger sein kann, wenn
man mit einem einfachen System zu tun hat. Es ist viel weniger wahrscheinlich,
dass man ein solches System versehentlich besch ädigt. Mut f ördert wiederum
Einfachheit, da man das System zu vereinfachen versucht, sobald man eine Mög-
lichkeit hierzu sieht. Konkrete Feedbacks f ördern Mut, da man sich viel sicherer
fühlt, wenn man nach einer radikalen Code änderung eine Taste dr ücken kann
und sieht, dass die Tests funktionieren (oder nicht, in welchem Fall Sie den Code
wegwerfen).
Die Werte in der Praxis
Ich bat das C3-Team (das erste große XP-Projekt, das ich bereits an früherer Stelle
erwähnte), mir etwas über den Moment zu erz ählen, auf den sie in dem Projekt
am stolzesten sind. Ich hoffte, Geschichten über gro ße Refactoring-Aktionen
oder entscheidende Tests oder einen gl ücklichen Kunden zu h ören. Stattdessen
erzählte man mir Folgendes:
Ich bin auf den Moment am stolzesten, als Edi eine Stelle annahm, die näher an seinem
Wohnsitz war, um sich die zwei Stunden t äglichen Hin- und Herfahrens zu ersparen
und mehr Zeit mit seiner Familie verbringen zu k önnen. Das Team hat seine Entschei-
dung voll und ganz respektiert. Niemand brachte etwas gegen ihn vor, weil er das Team
verlassen wollte. Jeder fragte bloß, ob er helfen könne.
--- PAGE 55 ---
 Die Werte in der Praxis 35
Dies weist auf einen tieferen Wert hin, einen Wert, der sich unterhalb der Ober-
fläche der anderen vier versteckt – Respekt. Wenn sich die Teammitglieder nicht
füreinander und für das, was der andere tut, interessieren, dann ist XP zum Schei-
tern verurteilt. Dies gilt wahrscheinlich auch für die meisten anderen Ansätze der
Softwareprogrammierung (oder überhaupt für die Arbeit), aber XP ist in dieser
Beziehung extrem empfindlich. Wenn grundlegende Sympathie und Interesse
vorhanden sind, dann wird in einem XP-Projekt genügend Schmierung für all die
Teile da sein, die aneinander reiben. Wenn sich die Mitglieder eines Teams nicht
für das Projekt interessieren, dann kann nichts und niemand das Projekt retten.
Sofern aber zumindest ein geringes Maß an Begeisterung gegeben ist, dann kann
XP für ein positives Feedback sorgen. Es geht dabei nicht um Manipulation, viel-
mehr geht es einfach darum, Spa ß daran zu haben, an einer Sache teilzuhaben,
die funktioniert, statt an einer Sache, die nicht funktioniert.
Dieses ganze hochgeistige Gerede ist ja sch ön und gut, aber wenn es keine M ög-
lichkeit gibt, das alles in der Praxis nachzuvollziehen, durchzusetzen und diese
Werte zur zweiten Natur werden zu lassen, dann haben wir nicht mehr vor uns,
als einen weiteren Sprung in den Sumpf methodisch guter Absichten. Wir m üs-
sen als Nächstes konkretere Richtlinien entwickeln, die uns zu Verfahren führen,
die jene vier Werte (Kommunikation, Einfachheit, Feedback und Mut) erf üllen
und repräsentieren.
--- PAGE 57 ---
8 Grundprinzipien
Von den vier Werten leiten wir einige Grundprinzipien als Richtlinien für unseren neuen
Stil ab. Wir überprüfen die vorgeschlagenen Entwicklungsverfahren daraufhin, ob sie
diesen Grundprinzipien genügen.
Die Fahrstundengeschichte erinnert uns daran, viele kleine Änderungen vorzu-
nehmen und dabei nie die Straße aus dem Blick zu verlieren. Die vier Werte –
Kommunikation, Einfachheit, Feedback und Mut – bilden unsere vier Kriterien
für eine erfolgreiche Lösung. Diese Werte sind jedoch zu vage, als dass sie uns bei
der Entscheidung, welche Verfahren verwendet werden sollen, unterstützen
könnten. Wir müssen die Werte in konkrete Prinzipien übersetzen, mit denen
wir arbeiten können.
Mithilfe dieser Prinzipien können wir zwischen verschiedenen Alternativen aus-
wählen. Wir werden derjenigen Alternative den Vorzug geben, die den Prinzi-
pien eher entspricht als die anderen Alternativen. Jedes Prinzip verkörpert die
Werte. Ein Wert ist etwas Unbestimmtes. Was für eine Person einfach ist, kann
für eine andere kompliziert sein. Ein Prinzip ist konkreter. Entweder bekommt
man ein unmittelbares Feedback oder nicht. Dies sind die Grundprinzipien:
 Unmittelbares Feedback
 Einfachheit anstreben
 Inkrementelle Veränderung
 Veränderungen wollen
 Qualitätsarbeit
Unmittelbares Feedback – Die Lernpsychologie lehrt, dass der Zeitraum zwischen
einer Aktion und deren Feedback für den Lernprozess von entscheidender Bedeu-
tung ist. Tierexperimente zeigen, dass bereits kleine Abweichungen im zeitlichen
Abstand des Feedbacks deutlich verschiedene Lernprozesse bedingen. Einige
Sekunden Verzögerung zwischen Reiz und Reaktion und die Maus lernt nicht,
dass der rote Knopf Futter bedeutet. Daher lautet eines der Prinzipien, möglichst
schnell Feedbacks zu erhalten, sie zu interpretieren und das Gelernte wieder dem
System zuzuführen. Das Unternehmen erkennt, wie das System am besten zur
Arbeit beitragen kann, und meldet diese Erkenntnis nach Tagen oder Wochen
statt nach Monaten oder Jahren zurück. Die Programmierer lernen, wie sie das
System am besten entwerfen, implementieren und testen, und melden diese
Erkenntnisse nach Sekunden oder Minuten statt nach Tagen, Wochen oder
Monaten zurück.
--- PAGE 58 ---
38 8 Grundprinzipien
Einfachheit anstreben – Behandeln Sie jedes Problem so, als wäre es lächerlich ein-
fach zu lösen. Die Zeit, die Sie bei 98% der Probleme sparen, f ür die dies zutrifft,
lässt Ihnen unglaubliche Ressourcen f ür die übrigen 2%. Dieses Prinzip ist f ür
Programmierer oft am schwersten zu akzeptieren. Wir werden üblicherweise dazu
angehalten, für die Zukunft zu planen und wiederverwendbare Softwaremodule
zu entwerfen. XP fordert dagegen, die heute anliegende Aufgabe gut zu erledigen
(Tests, Refactoring, Kommunikation) und der F ähigkeit zu vertrauen, Komplexi-
tät bei Bedarf zu einem sp äteren Zeitpunkt hinzuf ügen zu k önnen. Die Ökono-
mie der Softwareentwicklung in Form von Optionen fördert diesen Ansatz.
Inkrementelle Veränderungen – Umfangreiche Änderungen, die auf einmal durch-
geführt werden, funktionieren einfach nicht. Sogar in der Schweiz, dem Zentrum
pedantischer Planung, wo ich nun lebe, versucht man nicht, radikale Ver ände-
rungen vorzunehmen. Jedes Problem wird durch eine Reihe kleinerer, jedoch
wirkungsvoller Änderungen gelöst.
Veränderungen wollen – Die beste Strategie ist diejenige, die das dringendste Prob-
lem löst und Ihnen gleichzeitig die meisten Optionen offen hält.
Qualitätsarbeit – Niemand arbeitet gern schlampig. Jeder möchte gute Arbeit leis-
ten. Von den vier Variablen von Entwicklungsprojekten – Umfang, Kosten, Zeit
und Qualität – ist Qualität eigentlich keine wirklich freie Variable. Die einzigen
möglichen Werte sind »hervorragend« und »äußerst hervorragend«, was davon
abhängt, ob es um Leben und Tod geht oder nicht. Andernfalls macht Ihnen Ihre
Arbeit keinen Spaß, Sie arbeiten nicht gut und mit dem Projekt geht es bergab.
Es folgen einige weniger zentrale Prinzipien. Mithilfe dieser Prinzipien k önnen
wir entscheiden, was in einer bestimmten Situation zu tun ist.
 Lernen lehren
 Kleine Anfangsinvestition
 Spielen, um zu gewinnen
 Gezielte Experimente
 Offene, ehrliche Kommunikation
 Die Instinkte der Mitarbeiter nutzen, nicht dagegen arbeiten
 Verantwortung übernehmen
 An örtliche Gegebenheiten anpassen
 Mit leichtem Gepäck reisen
 Ehrliches Messen (engl. honest measurement)
--- PAGE 59 ---
8 Grundprinzipien 39
Lernen lehren (teach learning)  – Statt eine Reihe doktrin ärer Aussagen zu machen,
wie z.B. »Du sollst testen wie XYZ «, konzentrieren wir uns darauf, Strategien
dafür zu lehren, wie man lernt, im richtigen Umfang zu testen oder ein System
zu entwerfen, zu überarbeiten oder etwas anderes zu tun. Wir werden uns einiger
dieser Ideen ganz sicher sein. Es wird andere Ideen geben, in die wir nicht so viel
Vertrauen haben, und diese Ideen werden wir als Strategien formulieren, anhand
derer die Leser ihre eigenen Antworten in Erfahrung bringen können.
Kleine Anfangsinvestition (small initial investment) – Zu viele Ressourcen zu früh in
einem Projekt einzusetzen führt zu Katastrophen. Knappe Budgets zwingen Pro-
grammierer und Kunden dazu, Anforderungen und Ansätze zu beschneiden. Die
Fokussierung, die ein knappes Budget mit sich bringt, ermutigt Sie dazu, bei
allem möglichst gute Arbeit zu leisten. Ressourcen können auch zu knapp bemes-
sen sein. Wenn Ihnen sogar die Ressourcen daf ür fehlen, ein einziges wichtiges
Problem zu lösen, dann ist das System, das Sie erarbeiten, bestimmt nicht interes-
sant. Falls jemand Umfang, Termine, Qualität und Kosten diktiert, dann werden
Sie wahrscheinlich nicht in der Lage sein, zu einem guten Ende zu kommen. In
den meisten F ällen kann man jedoch mit weniger Ressourcen auskommen, als
man gerne hätte.
Spielen, um zu gewinnen (play to win) – Es war immer eine Freude, dem UCLA-Bas-
ketball-Team von John Wooden zuzusehen. In der Regel vernichtete dieses Team
den Gegner. Auch wenn der Spielstand noch in den letzten Minuten knapp war,
war das UCLA-Team absolut sicher, das Spiel zu gewinnen. Schließlich hatte man
so viele Male zuvor gewonnen. Daher war das Team entspannt. Es tat, was es tun
musste, und gewann erneut.
Ich erinnere mich an ein Basketballspiel mit einem Team aus Oregon, das im
Gegensatz hierzu ganz anders verlief. Das Team aus Oregon spielte gegen ein
Team aus Arizona, das zu den besten des Landes geh örte und vier Spieler an die
NBA abgeben sollte. Zur Halbzeit lag Oregon erstaunlicherweise mit 12 Punkten
vorn. Arizona gelang nichts und Oregons Angriffsspieler stellten das Team aus
Arizona vor ein R ätsel. Nach der Halbzeitpause versuchte Oregon jedoch, m ög-
lichst langsam zu spielen und das Spiel zu verz ögern, um den Vorsprung zu hal-
ten. Diese Strategie hat nicht funktioniert. Arizona fand Wege, seine spielerische
Überlegenheit zu nutzen und das Spiel zu gewinnen.
Der Unterschied besteht darin, ob man spielt, um zu gewinnen, oder ob man
spielt, um nicht zu verlieren. Die meisten Softwareentwicklungsprojekte, die ich
kenne, werden gespielt, um nicht zu verlieren. Es wird eine Menge Papier vollge-
schrieben. Es werden eine Menge Meetings abgehalten. Jeder versucht, »genau
nach Vorschrift« zu entwickeln, nicht, weil dies besonders sinnvoll erscheint, son-
--- PAGE 60 ---
40 8 Grundprinzipien
dern weil man am Schluss sagen können möchte, dass man sich keiner Schuld be-
wusst ist, weil man sich genau an die Regeln gehalten hat. Man hält sich bedeckt.
Softwareentwicklung, die auf Sieg spielt, tut alles, was dem Team diesen Sieg
ermöglicht, und tut nichts, was nicht zum Sieg beiträgt.
Gezielte Experimente (concrete experiments) – Wann immer man eine Entscheidung
fällt und diese nicht überprüft, besteht eine gewisse Wahrscheinlichkeit, dass
falsch ist. Je mehr Entscheidungen man trifft, desto st ärker wachsen die damit
verbundenen Risiken an. Das Ergebnis einer Designsitzung sollte daher eine
Reihe von Experimenten sein, mit denen sich Fragen, die w ährend der Sitzung
gestellt wurden, überprüfen lassen, und kein fertiges Design. Ergebnis einer Dis-
kussion der Anforderungen sollte auch eine Reihe von Experimenten sein. Jede
abstrakte Entscheidung sollte getestet werden.
Offene, ehrliche Kommunikation  – Dies ist eine so selbstverst ändliche Forderung,
dass ich sie fast weggelassen hätte. Wer würde nicht gern offen und ehrlich kom-
munizieren? Programmierer müssen in der Lage sein, die Konsequenzen von an-
derer Leute Entscheidungen zu erklären: »Du hast hier gegen die Kapselung versto-
ßen und das hat mich wirklich durcheinander gebracht. « Sie m üssen einander
sagen können, wo Probleme im Code vorhanden sind. Sie dürfen keine Angst ha-
ben, ihre Befürchtungen zu äußern und um Unterstützung zu bitten. Sie müssen
die Freiheit haben, den Kunden und dem Management schlechte Nachrichten zu
überbringen – und zwar frühzeitig –, und dafür nicht bestraft zu werden.
Wenn ich mitbekomme, wie sich jemand umsieht und nach m öglichen Zuhö-
rern Ausschau h ält, bevor er eine Frage beantwortet, dann ist das f ür mich ein
Anzeichen dafür, dass das Projekt in ernsten Schwierigkeiten steckt. Falls persön-
liche Dinge besprochen werden, kann ich das Bed ürfnis nach Privatheit verste-
hen. Aber die Frage, welches von zwei Objektmodellen verwendet werden soll, ist
keine Angelegenheit, die als »Geheimsache« deklariert werden sollte.
Die Instinkte der Mitarbeiter f ür sich nutzen, nicht dagegen arbeiten  – Man gewinnt
gern. Man lernt gern. Man sucht die Interaktion mit anderen. Man ist gern Teil
eines Teams. Man hat gern alles unter Kontrolle. Man sch ätzt es, wenn andere
einem vertrauen. Man leistet gern gute Arbeit. Man möchte, dass die eigene Soft-
ware funktioniert.
Paul Chisolm schreibt:
Ich nahm an einer Sitzung teil, auf der der M öchtegernmanager der Qualitätskontrolle
vorschlug, etwa ein halbes Dutzend Felder hinzuzuf ügen (zu einem Online-Formular,
das bereits voll von Daten war, die von keinem verwendet wurden), nicht weil die Infor-
--- PAGE 61 ---
8 Grundprinzipien 41
mationen nützlich sein w ürden, sondern weil man durch das Ausf üllen dieser Felder
angeblich ZEIT SPAREN w ürde. Meine Reaktion war, dass ich meinen Kopf auf den
Konferenztisch schlug, wie eine Zeichentrickfigur der Warner Brothers, die gerade etwas
Unglaubliches gehört hat, und ihm sagte, er solle aufh ören, mich anzulügen. (Bis zum
heutigen Tag bin ich mir nicht sicher, ob dies eines der unprofessionellsten Dinge war,
die ich jemals getan habe, oder aber eines der professionellsten. Ein Augenarzt sagte
mir, ich solle aufh ören, den Kopf gegen Dinge zu schlagen, da sich dadurch die Netz-
haut lösen könnte.) (Quelle: E-Mail)
Es ist schwierig, ein Verfahren zu entwerfen, bei dem die Verfolgung kurzfristiger
Eigeninteressen gleichzeitig langfristigen Interessen des Teams dient. Man kann
so lange und so oft, wie man will, behaupten, dass irgendein Verfahren langfris-
tig im Interesse aller ist, aber wenn das Verfahren ein unmittelbares Problem
nicht lösen kann und der Druck steigt, dann wird man das Verfahren verwerfen.
Wenn XP nicht mit den kurzfristigen Interessen der Beteiligten arbeiten kann,
dann ist XP zu einem Dasein in der dunklen methodologischen Peripherie verur-
teilt.
Einige Leute sch ät z e n  a n  X P ,  d a s s  h i e r  z u  s e h e n  i s t ,  w a s  P r o g r a m m i e r e r  t u n ,
wenn sie sich selbst überlassen bleiben, und gerade so viel Kontrolle ausge übt
wird, um den gesamten Prozess auf dem richtigen Gleis zu halten. Ich erinnere
mich an eine Bemerkung, die, lautete: »XP entspricht der Beobachtung von Pro-
grammierern auf freier Wildbahn.«
Verantwortung übernehmen (accepted responsibility) – Nichts schwächt das Engage-
ment eines Teams oder eines einzelnen so sehr, wie gesagt zu bekommen, was
man tun soll, insbesondere wenn die Aufgabe offensichtlich unm öglich zu
bewältigen ist. Autorit ätsbekundungen funktionieren nur dann, wenn man
Leute dazu bringt, so zu tun, als seien sie einverstanden. Wenn jemandem vorge-
schrieben wird, was er zu tun hat, wird er im Lauf der Zeit tausend Möglichkeiten
finden, seine Frustration zum Ausdruck zu bringen, was sich meist zum Nachteil
des Teams und häufig zum Nachteil des Betroffenen selbst entwickelt.
Die Alternative besteht darin, dass Verantwortung übernommen, statt zugewie-
sen wird. Das heißt nicht, dass man immer genau das tun kann, wozu man Lust
hat. Man ist Teil eines Teams und wenn das Team zu dem Schluss kommt, dass
eine bestimmte Aufgabe erledigt werden muss, dann muss jemand diese Aufgabe
übernehmen, ganz gleich wie unangenehm sie sein mag.
An örtliche Gegebenheiten anpassen (local adaption) – Sie müssen das, was Sie in die-
sem Buch lesen, an die Gegebenheiten anpassen, die Sie konkret vorfinden. Dies
ist die Anwendung übernommener Verantwortung auf Ihren Entwicklungspro-
--- PAGE 62 ---
42 8 Grundprinzipien
zess. XP anzupassen hei ßt nicht, dass ich entscheide, wie Sie entwickeln sollen.
Es heißt, dass Sie entscheiden, wie Sie entwickeln. Ich kann Ihnen sagen, was
meiner Erfahrung nach funktioniert. Ich kann die Konsequenzen aufzeigen, die
meiner Meinung nach ein Abweichen von den hier beschriebenen Verfahren
hat. Schlussendlich ist es jedoch Ihr Prozess. Sie m üssen heute über irgendetwas
entscheiden. Sie müssen wissen, ob das morgen auch noch funktioniert. Sie müs-
sen ändern und anpassen. Sie sollen dies nicht lesen und denken: »Endlich weiß
ich, wie man programmiert. « Sie sollten nach der Lekt üre sagen: »Ich soll all
diese Entscheidungen treffen und programmieren?« Genau, das sollen Sie. Aber
es ist es wert.
Mit leichtem Gep äck reisen (travel light)  – Man kann nicht erwarten, sich schnell
bewegen zu k önnen, wenn man eine Menge Gep äck mit sich herumschleppt.
Wir sollten Dinge behalten, die sich durch folgende Eigenschaften auszeichnen:
 wenig
 einfach
 wertvoll
Das XP-Team verwandelt sich in intellektuelle Nomaden, die stets darauf vorbe-
reitet sind, rasch die Zelte abzubrechen und der Herde zu folgen. Die Herde kann
in diesem Fall das Design sein, das sich in eine andere Richtung entwickelt als
erwartet, oder eine Technologie, die plötzlich in aller Munde ist, oder eine verän-
derte Geschäftslage.
Wie Nomaden gewöhnt sich das XP-Team daran, mit leichtem Gepäck zu reisen.
Man schleppt nicht viel Ballast mit sich, sondern nur das, was unbedingt erfor-
derlich ist, um weiterhin f ür den Kunden Wert schaffen zu k önnen – Tests und
Code.
Ehrliches Messen (honest measurement)  – Unser Streben nach Kontrolle über die
Softwareentwicklung hat uns dazu gebracht, unsere Arbeit zu messen, was in
Ordnung ist. Allerdings hat es uns auch dazu gebracht, auf einer Detailebene zu
messen, die von unseren Instrumenten nicht unterstützt wird. Es ist besser, man
sagt: »Dies wird ungefähr zwei Wochen dauern«, als zu sagen: »14,176 Stunden«,
wenn man die genaue Zeitdauer nicht mit Sicherheit einschätzen kann. Wir wer-
den uns auch darum bem ühen, Maßeinheiten zu finden, die in einer Beziehung
zu der von uns angestrebten Arbeitsweise stehen. Beispielsweise sind Codezeilen
eine nutzlose Maßeinheit angesichts von Code, der schrumpft, wenn wir lernen,
wie man bessere Programmiertechniken einsetzt.
--- PAGE 63 ---
9 Zurück zu den Grundlagen
Wir möchten alles Nötige tun, um eine stabile, vorhersehbare Softwareentwicklung zu
erhalten. Allerdings haben wir keine Zeit für zusätzliche Arbeiten. Die vier grundlegen-
den Arbeitsschritte der Softwareentwicklung sind Programmieren, Testen, Zuhören und
Entwerfen.
»Fahren lernen«. Vier Werte – Kommunikation, Einfachheit, Feedback und Mut.
Etwa zwei Dutzend Prinzipien. Jetzt sind wir bereit, mit dem Aufbau einer Diszi-
plin der Softwareentwicklung zu beginnen. Der erste Schritt besteht darin, über
den Umfang zu entscheiden. Was genau versuchen wir vorzuschreiben? Auf wel-
che Art von Problemen gehen wir ein und welche Art von Probleme werden wir
ignorieren?
Ich erinnere mich daran, wie ich zuerst in BASIC zu programmieren gelernt habe.
Ich besaß einige Arbeitsbücher, die die Grundlagen der Programmierung behan-
delten. Ich hatte diese Bücher schnell durchgearbeitet. Danach wollte ich ein
anspruchsvolleres Problem angehen als die kleinen Übungen in diesen Büchern.
Ich beschloss, ein StarTrek-Spiel zu schreiben, das einem Spiel ähneln sollte, wel-
ches ich in Berkeley in der Lawrence Hall of Science gespielt hatte, aber noch bes-
ser sein sollte.
Mein Verfahren zum Schreiben eines Programms, mit dem die Arbeitsbuchübun-
gen gelöst werden sollten, bestand darin, einige Minuten lang auf das Problem zu
starren, den Code zu seiner Lösung einzutippen und dann die Probleme zu lösen,
die der Code verursachte. Ich setzte mich also zuversichtlich an meinen Compu-
ter, um mein Spiel zu schreiben. Aber ich hatte keine Ahnung, wie man eine
Anwendung schreiben sollte, die mehr als 20 Zeilen umfasst. Ich ging vom Com-
puter weg und versuchte, ein ganzes Programm auf Papier zu schreiben, bevor
ich es eingab. Nach drei Zeilen kam ich wieder nicht mehr weiter.
Ich musste etwas tun, was über die Programmierung hinausging. Aber ich konnte
nur programmieren.
Was passiert, wenn wir jetzt, um einige Erfahrungen reicher, zu diesem Zustand
zurückkehren? Was würden wir tun? Wir wissen, dass wir nicht einfach »pro-
grammieren können, bis wir fertig sind.« Welche Arbeitsschritte würden wir
noch aufnehmen? Was würden wir von den einzelnen Schritten erwarten, wenn
wir sie nochmals zum ersten Mal ausführten?
--- PAGE 64 ---
44 9 Zur ück zu den Grundlagen
Programmieren
Am Ende des Arbeitstages muss es ein Programm geben. Daher nominiere ich das
Programmieren zu dem Schritt, ohne den wir nicht auskommen. Ob Sie nun Dia-
gramme zeichnen, die Code generieren, oder etwas in einen Browser eingeben –
Sie programmieren.
Was erwarten wir vom Code? Die wichtigste Sache ist das Lernen. Ich lerne,
indem ich einen Gedanken habe und diesen dann teste, um zu sehen, ob er
etwas taugt. Programmieren ist die beste M öglichkeit, dies zu tun. Programm-
code wird nicht durch die Macht und Logik der Rhetorik beeinflusst. Code l ässt
sich nicht durch Universitätsabschlüsse oder dicke Gehälter beeindrucken. Code
ist einfach da und führt das aus, was Sie ihn zu tun angewiesen haben. Falls dies
nicht dem entspricht, was Sie glaubten, angewiesen zu haben, dann ist das Ihr
Problem.
Wenn Sie etwas programmieren, dann haben Sie zudem die M öglichkeit, zu ler-
nen, wie der Programmcode am besten strukturiert wird. Es gibt bestimmte
Anzeichen im Code, an denen Sie erkennen können, dass Sie bislang noch nicht
die notwendige Struktur verstanden haben.
Code gibt Ihnen auch die M öglichkeit, klar und pr äzise zu kommunizieren.
Wenn Sie eine Idee haben und sie mir zu erkl ären versuchen, kann es passieren,
dass ich Sie missverstehe. Wenn wir die Idee jedoch zusammen in Programm-
code fassen, dann kann ich anhand der Logik Ihres Programmcodes die Gestalt
Ihrer Idee pr äzise erkennen. Ich sehe die Gestalt Ihrer Ideen hier so, wie sie
gegenüber der Außenwelt ausgedrückt werden, und nicht so, wie Sie sie im Kopf
haben.
Diese Kommunikation kann zu einer Lernerfahrung f ühren. Ich erkenne Ihre
Idee und mir f ällt selbst etwas ein. Ich habe Schwierigkeiten, meine Idee in
Worte zu fassen und verwende daher auch Programmcode, um sie auszudrücken.
Da es sich um eine Idee handelt, die mit Ihrer Idee in Beziehung steht, steht auch
unser Code miteinander in Beziehung. Sie sehen meine Idee und haben wie-
derum eine andere Idee.
Programmcode ist dar über hinaus der Teil, ohne den die Entwicklung absolut
nicht auskommen kann. Ich habe von Systemen geh ört, die in Produktion blie-
ben, obwohl der gesamte Quellcode verloren gegangen war. Allerdings passiert so
etwas immer seltener. Damit ein System lebensfähig bleibt, muss es seinen Quell-
code bewahren.
--- PAGE 65 ---
 Testen 45
Da der Quellcode vorliegen muss, sollten wir ihn in der Softwareentwicklung für
möglichst viele Zwecke verwenden. Es stellt sich heraus, dass man den Code als
Kommunikationsmittel nutzen kann – um taktische Vorhaben auszudr ücken,
Algorithmen zu beschreiben, Ansatzpunkte für künftige Erweiterungen oder Kür-
zungen aufzuzeigen. Code kann auch eingesetzt werden, um Tests auszudrücken,
Tests, die sowohl die Funktionsweise des Systems objektiv testen als auch eine
wertvolle operationale Spezifikation des Systems auf allen Ebenen bieten k ön-
nen.
Testen
Die englischen Philosophen und Positivisten Locke, Berkeley und Hume behaup-
teten, dass nur das, was sich messen l ässt, existiert. Was Programmcode betrifft,
stimme ich dieser Behauptung uneingeschränkt zu. Softwarefunktionen, die sich
nicht durch automatisierte Tests vorf ühren lassen, existieren einfach nicht. Ich
kann mich ohne weiteres selbst glauben machen, dass ich genau das geschrieben
habe, was ich schreiben wollte. Ich kann mich auch ohne weiteres davon überzeu-
gen, dass das, was ich schreiben wollte, genau das ist, was ich schreiben sollte.
Daher vertraue ich meinen Programmen erst dann, wenn ich Tests dafür habe. Die
Tests geben mir die M öglichkeit, unabhängig von der Implementierung dar über
nachzudenken, was ich möchte. Die Tests geben dann darüber Aufschluss, ob ich
tatsächlich das implementiert habe, was ich implementieren wollte.
Die meisten Leute assoziieren mit automatisierten Tests Funktionstests, d.h.
Tests, die prüfen, welche Zahlen berechnet werden. Je mehr Erfahrungen ich im
Schreiben von Tests sammle, desto mehr M öglichkeiten entdecke ich, Tests f ür
nichtfunktionale Anforderungen zu schreiben, wie z.B. f ür die Performanz oder
die Einhaltung bestimmter Standards.
Erich Gamma prägte den Ausdruck »testinfiziert«, um Leute zu beschreiben, die
erst dann zu programmieren anfangen, wenn sie bereits einen Test haben.
Anhand der Tests erkennen Sie, wann Sie fertig sind – wenn die Tests fehlerfrei
ausgeführt werden, sind Sie vorerst einmal mit dem Programmieren fertig. Wenn
Ihnen keine Tests mehr einfallen, die Fehler aufdecken k önnten, dann sind Sie
wirklich fertig.
Tests sind sowohl eine Ressource als auch eine Verantwortung. Es ist nicht so,
dass Sie einen Test schreiben, diesen ausführen und dann fertig sind; damit ist es
nicht getan. Sie sind daf ür verantwortlich, jeden Test zu schreiben, von dem Sie
vermuten, er könnte fehlschlagen. Nach einer Weile werden Sie Tests besser ein-
zuschätzen lernen – wenn diese beiden Tests funktionieren, dann kann ich
--- PAGE 66 ---
46 9 Zur ück zu den Grundlagen
getrost darauf schließen, dass auch dieser dritte Test funktioniert, ohne ihn expli-
zit programmieren zu müssen. Natürlich ist dies genau die Art von Schlussfolge-
rung, die zu Bugs in Programmen f ührt, und daher m üssen Sie vorsichtig damit
sein. Falls sp äter Probleme auftreten, die durch diesen dritten Test aufgedeckt
worden wären, dann m üssen Sie bereit sein, daraus zu lernen und das n ächste
Mal diesen dritten Test eben zu schreiben.
Die meiste Software wird ausgeliefert, ohne in der Entwicklung umfassende auto-
matisierte Tests durchlaufen zu haben. Automatisierte Tests sind sicherlich nicht
unabdingbar. Warum lasse ich also das Testen in meiner Liste unabdingbarer
Aktivitäten nicht weg? Ich habe zwei Antworten: eine kurzfristige und eine lang-
fristige.
Die langfristige Antwort lautet, dass Tests Programme l änger am Leben erhalten
(sofern die Tests ausgef ührt und gepflegt werden). Wenn Tests vorliegen, dann
können Sie über längere Zeit mehr Änderungen vornehmen, als ohne Tests. Ihr
Vertrauen in das System wird mit der Zeit st ärker, wenn Sie kontinuierlich Tests
schreiben.
Eines unserer Prinzipien ist, nicht gegen die menschliche Natur zu arbeiten, son-
dern Instinkte zu nutzen. Wenn Sie nur das Argument h ätten, dass sich das Tes-
ten langfristig auszahlt, dann h ätte das Testen keine Chance. Einige Leute w ür-
den aus Pflichtgef ühl testen oder weil ihnen jemand über die Schulter blickt.
Sobald die Aufmerksamkeit oder der Druck nachl ässt, würden keine neuen Tests
geschrieben und die vorhandenen Tests w ürden nicht mehr ausgef ührt; die
ganze Sache würde sich auflösen. Wenn wir nicht gegen die menschliche Natur
arbeiten wollen, dann müssen wir kurzfristige Gründe für das Testen finden.
Glücklicherweise gibt es einen Grund, warum sich das Schreiben von Tests auch
kurzfristig lohnt. Das Programmieren macht viel mehr Spaß, wenn man mit Tests
arbeitet. Sie müssen sich nicht lange mit zermürbenden Gedanken aufhalten wie:
»Nun gut, ich weiß, dass dies jetzt richtig ist, aber habe ich damit etwas anderes
zerstört?« Sie dr ücken einfach die Testtaste. F ühren Sie s ämtliche Tests aus.
Wenn Sie gr ünes Licht erhalten, dann k önnen Sie die n ächste Aufgabe wieder
zuversichtlicher in Angriff nehmen.
Ich habe mich dabei ertappt, wie ich in einer öffentlichen Programmiervorfüh-
rung so vorging. Jedes Mal, wenn ich mich vom Publikum abwandte, um mit
dem Programmieren zu beginnen, dr ückte ich meine Testtaste. Ich hatte nichts
am Code geändert. Auch sonst war nichts ver ändert worden. Ich wollte einfach
eine Portion Vertrauen bekommen. Zu sehen, dass die Tests immer noch funktio-
nieren, hat mir dieses Vertrauen gegeben.
--- PAGE 67 ---
 Testen 47
Zusammen zu programmieren und zu testen ist auch schneller, als nur zu pro-
grammieren. Als ich anfing, habe ich diesen Effekt nicht erwartet, mir ist er aber
natürlich aufgefallen und ich habe von einer Menge anderer Leute geh ört, dass
sie die gleiche Erfahrung gemacht haben. Wenn Sie nicht testen, gewinnen Sie
vielleicht eine halbe Stunde. Sobald Sie sich einmal an das Testen gew öhnt
haben, werden Sie aber bald einen Unterschied hinsichtlich der Produktivit ät
feststellen. Die Erh öhung der Produktivit ät ergibt sich daraus, dass Sie weniger
Zeit f ür das Debuggen aufwenden. Sie m üssen nicht mehr stundenlang nach
einem Bug suchen, Sie finden ihn innerhalb weniger Minuten. Gelegentlich will
ein Test einfach nicht laufen. In solchen F ällen haben Sie es wahrscheinlich mit
einem größeren Problem zu tun und Sie müssen dann zurückgehen und überprü-
fen, ob die Tests korrekt sind oder ob das Design verbessert werden muss.
Es gibt jedoch eine Gefahr. Schlechte Tests werden zu rosaroten Brillen. Sie
gewinnen fälschlicherweise den Eindruck, dass das System funktioniert, da alle
Tests ausgeführt werden. Sie machen weiter und sind sich nicht bewusst, dass Sie
sich eine Falle gestellt haben, die zuschnappt, wenn Sie sich das n ächste Mal in
diese Richtung bewegen.
Beim Testen kommt es darauf an, das richtige Ma ß an gerade noch tolerierbaren
Mängeln zu finden. Wenn Sie mit einer Kundenbeschwerde im Monat leben
können, dann investieren Sie in das Testen und verbessern das Testverfahren, bis
Sie dort angelangt sind. Dann setzen Sie diesen Teststandard ein und machen so
weiter, als w äre das System v öllig in Ordnung, wenn alle Tests ausgef ührt wer-
den.
Wie ich sp äter darlegen werde, haben wir es mit zwei Kategorien von Tests zu
tun. Wir haben Komponententests, die von den Programmierern geschrieben
werden, um sich davon zu überzeugen, dass ihre Programme so arbeiten, wie sie
sich das vorstellen. Wir haben zudem Funktionstests, die von den Kunden
geschrieben (oder zumindest spezifiziert) werden, um sich davon zu erzeugen,
dass das System als Ganzes so arbeitet, wie sie es sich vorstellen.
Es gibt zwei Zielgruppen f ür Tests. Die Programmierer m üssen ihr Vertrauen in
Form von Tests konkretisieren, damit auch alle anderen das gleiche Vertrauen
haben können. Die Kunden müssen eine Reihe von Tests vorbereiten, die ihrem
Vertrauen Ausdruck geben: »Ich denke, wenn man all diese F älle berechnen
kann, muss das System funktionieren.«
--- PAGE 68 ---
48 9 Zur ück zu den Grundlagen
Zuhören
Programmierer haben von nichts Ahnung. Oder besser, Programmierer haben
von nichts Ahnung, von dem die Gesch äftsleute denken, dass es von Interesse
ist. Ich glaube, wenn Geschäftsleute ohne uns Programmierer auskommen könn-
ten, dann würden sie uns blitzschnell rauswerfen.
Worauf will ich damit hinaus? Wenn Sie beschließen zu testen, dann müssen Sie
die Antworten von irgendwoher bekommen. Da Sie (als Programmierer) keine
Ahnung haben, müssen Sie andere fragen. Die anderen werden Ihnen sagen, wel-
che Antworten erwartet werden und wie aus der Gesch äftsperspektive einige der
ungewöhnlichen Fälle aussehen.
Wenn Sie vorhaben, Fragen zu stellen, dann müssen Sie auch bereit sein, sich die
Antworten anzuhören. Daher ist Zuhören die dritte Aktivität in der Softwareent-
wicklung.
Programmierer müssen auch einem größeren Publikum zuhören. Sie müssen dem
Kunden zuhören, worin seiner Meinung nach das zu l ösende Geschäftsproblem
besteht. Sie helfen dem Kunden zu verstehen, was schwierig und was einfach ist,
daher ist es eine Art von aktivem Zuhören. Das Feedback, das sie dem Kunden ge-
ben, hilft diesem, das vorliegende Geschäftsproblem besser zu verstehen.
Einfach zu sagen, Sie sollten einander und dem Kunden zuh ören, ist nicht sehr
hilfreich. Die Leute versuchen es und es funktioniert nicht. Wir m üssen eine
Möglichkeit finden, die Kommunikation in einer Weise zu strukturieren, dass die
Dinge, die mitgeteilt werden m üssen, dann mitgeteilt werden, wenn sie mitge-
teilt werden m üssen, und in der Ausf ührlichkeit, in der sie mitgeteilt werden
müssen. Umgekehrt sollen die von uns entwickelten Regeln eine Kommunika-
tion verhindern, die nicht weiterhilft oder die stattfindet, bevor das, was mitge-
teilt wird, wirklich verstanden worden ist, oder die so ausf ührlich ist, dass nicht
erkennbar ist, welcher Teil der Mitteilung wichtig ist.
Design entwerfen
Warum kann man nicht einfach zuh ören, einen Testfall schreiben, diesen aus-
führen, zuhören, einen Testfall schreiben, diesen ausf ühren und dies unendlich
fortsetzen? Weil wir wissen, dass es so nicht funktioniert. Man kann das eine Zeit
lang tun. Bei Verwendung einer nachsichtigen Sprache kann man das sogar eine
recht lange Zeit lang tun. Irgendwann einmal wird man jedoch so nicht mehr
weiterkommen. Die einzige M öglichkeit, den n ächsten Testfall lauff ähig zu
--- PAGE 69 ---
 Design entwerfen 49
machen, besteht dann darin, einen anderen au ßer Kraft zu setzen. Oder die ein-
zige Möglichkeit, einen Testfall zum Laufen zu bringen, ist sehr viel aufwändiger,
als es der Test eigentlich wert ist. Die Entropie fordert ein weiteres Opfer.
Die einzige Möglichkeit, dies zu vermeiden, besteht darin, ein Design zu entwer-
fen. Mit dem Entwurf eines Designs ist die Schaffung einer Struktur zur Organisa-
tion der Logik des Systems gemeint. Ein gutes Design strukturiert die Logik so,
dass eine Änderung an einem Teil des Systems nicht unbedingt eine Änderung
an einem anderen Teil des Systems bedingt. Ein gutes Design stellt sicher, dass
jedes Element der Logik des System nur an einer Stelle beheimatet ist. Ein gutes
Design rückt die Logik in die N ähe der Daten, die damit verarbeitet werden. Ein
gutes Design erlaubt eine Erweiterung des Systems, wobei nur an einer Stelle Ver-
änderungen vorzunehmen sind.
Ein schlechtes Design ist dem entgegengesetzt. Eine konzeptionelle Änderung
erfordert Änderungen an vielen Teilen des Systems. Logik muss dupliziert wer-
den. Die Kosten, die ein schlechtes Design verursacht, werden zu guter Letzt
untragbar sein. Man kann sich einfach nicht mehr daran erinnern, an welchen
Stellen die implizit miteinander verknüpften Änderungen vorgenommen werden
müssen. Man kann keine neuen Funktionen hinzuf ügen, ohne vorhandene
Funktionen außer Kraft zu setzen.
Komplexität ist eine weitere Quelle schlechten Designs. Wenn ein Design vier
Ableitungsebenen erfordert, bis man herausfindet, was tats ächlich vor sich geht,
und wenn diese Ebenen keinen besonderen funktionellen oder didaktischen
Zweck erfüllen, dann ist das Design schlecht.
Daher besteht der letzte Schritt zur Strukturierung unserer neuen Disziplin im
Entwurf eines Designs. Wir müssen einen Kontext zur Verfügung stellen, in dem
gute Designs entworfen werden, schlechte Designs korrigiert werden und das
aktuelle Design von all denjenigen verstanden wird, die es verstehen müssen.
Wie Sie in den folgenden Kapiteln sehen werden, unterscheidet sich die Art und
Weise, in der XP ein Design schafft, stark von anderen Verfahren der Software-
entwicklung. In XP gehört das Design beim Programmieren zum Alltagsgesch äft
aller Programmierer. Aber ungeachtet der Strategie, die zur Erreichung eines
Designs eingesetzt wird, ist der Schritt des Entwurfs eines Designs nicht optional.
Das Design muss unbedingt ber ücksichtigt werden, damit die Softwareentwick-
lung effizient sein kann.
--- PAGE 70 ---
50 9 Zur ück zu den Grundlagen
Schlussfolgerung
Sie programmieren, weil Sie nichts leisten, wenn Sie nicht programmieren. Sie
testen, weil Sie sonst nicht wissen, wann Sie mit dem Programmieren fertig sind.
Sie hören zu, weil Sie sonst nicht wissen, was Sie programmieren und testen sol-
len. Und Sie entwerfen ein Design, damit Sie unendlich lange programmieren,
testen und zuhören können. So sieht es aus. Dies sind die Arbeiten, die wir struk-
turieren müssen:
 Programmieren
 Testen
 Zuhören
 Designentwurf
--- PAGE 71 ---
Teil 2
Die Lösung
Wir haben nun die Grundlage geschaffen. Wir wissen, welches Problem wir lösen
müssen, nämlich zu entscheiden, wie die vier grundsätzlichen Arbeitsschritte der
Softwareentwicklung – Programmieren, Testen, Zuhören und Entwerfen eines
Designs – ausgeführt werden sollen. Wir haben eine Reihe von Werten und Prin-
zipien zur Hand, an denen wir uns bei der Auswahl von Strategien für diese Akti-
vitäten orientieren können. Und wir haben eine abgeflachte Kostenkurve im
Ärmel, um die von uns gewählten Strategien zu vereinfachen.
--- PAGE 73 ---
10 Kurzer Überblick
Wir werden uns auf die Synergien zwischen einfachen Verfahren verlassen, Verfahren,
die man vor Jahrzehnten häufig als unpraktikabel oder naiv eingeschätzt und aufgege-
ben hat.
Die Rohmaterialien unserer neuen Methode der Softwareentwicklung sind:
• die Geschichte von der Fahrstunde
 die vier Werte – Kommunikation, Einfachheit, Feedback und Mut
 die Prinzipien
 die vier grundlegenden Arbeitsschritte – Programmieren, Testen, Zuhören
und Designentwurf
Unsere Aufgabe ist es nun, diese vier Arbeiten zu strukturieren. Wir müssen sie
allerdings nicht nur strukturieren, sondern dabei auch die lange Liste der gele-
gentlich widersprüchlichen Prinzipien berücksichtigen. Gleichzeitig müssen wir
versuchen, die wirtschaftliche Leistung der Softwareentwicklung so weit zu ver-
bessern, dass man uns ernst nimmt.
Kein Problem.
Äh ...
Da dieses Buch erklären soll, wie dies funktionieren kann, erläutere ich jetzt kurz
die Hauptverfahrensbereiche in XP. Im nächsten Kapitel werden wir sehen, wie
solch lächerlich einfache Lösungen tatsächlich funktionieren können. Wenn ein
Verfahren schwach ist, dann gleichen die Stärken der anderen Verfahren diese
Schwäche aus. In späteren Kapiteln werden wir auf einige dieser Themen näher
eingehen. 
Zunächst folgt eine Aufstellung sämtlicher Verfahren:
 Das Planungsspiel – Legen Sie den Umfang der nächsten Version rasch fest,
indem Sie Geschäftsprioritäten mit technischen Aufwandsschätzungen kom-
binieren. Wenn die Realität den Plan einholt, dann muss der Plan aktualisiert
werden.
 Kurze Releasezyklen – Gehen Sie mit einem einfachen System schnell in Pro-
duktion und bringen Sie dann innerhalb sehr kurzer Zeit die nächste Version
heraus.
 Metapher – Sämtliche Entwicklungen werden an einer einfachen gemeinsa-
men Metapher ausgerichtet, die die Funktionsweise des gesamten Systems
veranschaulicht.
--- PAGE 74 ---
54 10 Kurzer Überblick
 Einfaches Design – Das System sollte zu jedem Zeitpunkt so einfach wie m ög-
lich strukturiert sein. L ösen Sie unn ötig komplexe Strukturen auf, sobald Sie
diese entdecken.
 Testen – Die Programmierer schreiben fortw ährend Komponententests, die
fehlerfrei ausgeführt werden m üssen, damit die Entwicklung voranschreiten
kann. Kunden schreiben Tests, um zu zeigen, dass Leistungsmerkmale fertig
gestellt sind.
 Refactoring – Die Programmierer strukturieren das System neu, ohne sein Ver-
halten zu ändern, um Redundanzen zu entfernen, die Kommunikation zu ver-
bessern, das System zu vereinfachen oder flexibler zu gestalten.
 Programmieren in Paaren – Der gesamte Produktionscode wird von zwei Pro-
grammierern geschrieben, die gemeinsam an einem Rechner sitzen.
 Gemeinsame Verantwortlichkeit – Jeder kann jederzeit beliebigen Code im Sys-
tem ändern.
 Fortlaufende Integration (continuous integration)- Das System wird mehrmals täg-
lich integriert und erstellt und zwar immer dann, wenn eine Aufgabe erledigt
worden ist.
 40-Stunden-Woche – Man arbeitet prinzipiell nicht mehr als 40 Stunden in der
Woche. Überstunden werden nie länger als eine Woche geleistet.
 Kunde vor Ort (on-site customer) – Dem Team sollte ein echter, lebender Benut-
zer angehören, der w ährend der gesamten Arbeitszeit zur Beantwortung von
Fragen zur Verfügung steht.
 Programmierstandards – Programmierer schreiben s ämtlichen Code entspre-
chend Regeln, die die Kommunikation mithilfe des Codes erleichtern.
In diesem Kapitel werden wir kurz zusammenfassen, was zur Aus übung der ein-
zelnen Verfahren gehört. Im nächsten Kapitel mit dem Titel »Wie kann das funk-
tionieren?« werden wir die Beziehungen zwischen diesen Verfahren untersu-
chen, die es erm öglichen, dass die Schw äche des einen Verfahrens durch die
Stärken der anderen Verfahren aufgewogen werden können.
Das Planungsspiel
Weder geschäftliche noch technische Überlegungen sollten Vorrang haben. Die
Softwareentwicklung ist ein fortwährender Dialog zwischen dem Möglichen und
dem Erwünschten. Es liegt im Wesen dieses Dialogs, dass sich sowohl das ändert,
was als möglich erachtet wird, als auch das, was als erwünscht erachtet wird.
--- PAGE 75 ---
 Das Planungsspiel 55
Die Geschäftsseite muss über Folgendes entscheiden:
 Umfang – In welchem Umfang muss ein Problem gel öst werden, damit das
System in der Produktion von Wert ist? Die Gesch äftsseite wei ß, wie viel
nicht genug und wie viel zu viel ist.
 Priorität – Wenn Sie entweder A oder B zuerst haben k önnen, welche Option
wählen Sie dann? Die Gesch äftsseite kann dies viel eher entscheiden als der
Programmierer.
 Zusammensetzung von Versionen – Wie viel oder wie wenig muss getan wer-
den, damit man von gesch äftlicher Seite aus von der Software profitieren
kann? Die intuitive Antwort der Programmierer auf diese Frage kann v öllig
falsch sein.
 Liefertermine – Welche wichtigen Termine gibt es, an denen die Präsentation
der Software (oder Teile davon) sich entscheidend auf das Geschäft auswirken
kann?
Die Gesch äftsleute k önnen diese Entscheidungen allerdings nicht in einem
Vakuum treffen. Die Entwickler m üssen die technischen Entscheidungen f ällen,
die das Rohmaterial für die geschäftlichen Entscheidungen liefern.
Die Entwickler entscheiden über Folgendes:
 Aufwandsschätzungen – Wie lange dauert es, ein bestimmtes Leistungsmerk-
mal zu implementieren?
 Konsequenzen – Es gibt strategische Gesch äftsentscheidungen, die nur dann
getroffen werden sollten, wenn man sich über die technischen Konsequenzen
informiert hat. Die Wahl einer Datenbank ist ein gutes Beispiel hierf ür. Die
Geschäftsleute arbeiten vielleicht lieber mit einem gro ßen Unternehmen als
mit einer jungen Firma, aber eine um Faktor 2 h öhere Produktivität mag es
Wert sein, das zusätzliche Risiko oder die damit einhergehenden Unbequem-
lichkeiten auf sich zu nehmen. Vielleicht auch nicht. Die Entwicklung muss
die Konsequenzen erklären.
 Prozess – Wie werden die Arbeit und das Team strukturiert? Das Team muss zu
der Umgebung passen, in der es arbeitet, sollte aber gute Software schreiben,
statt die Ungereimtheiten der Umgebung zu bewahren.
 Genaue Terminplanung – Welche Leistungsmerkmale sollten innerhalb einer
Version zuerst implementiert werden? Die Programmierer m üssen den Frei-
raum haben, die risikoreichsten Entwicklungssegmente zuerst einzuplanen,
um das Gesamtrisiko des Projekts zu reduzieren. Auch unter dieser Vorausset-
--- PAGE 76 ---
56 10 Kurzer Überblick
zung müssen die Gesch äftsprioritäten früh im Entwicklungsprozess beachtet
werden, damit die Wahrscheinlichkeit verringert wird, dass wichtige Leis-
tungsmerkmale am Ende der Entwicklung einer Version wegfallen müssen.
Kurze Releasezyklen
Jede Version sollte m öglichst klein gehalten werden und gleichzeitig die wert-
vollsten Geschäftsanforderungen erfüllen. Die Version muss als Ganzes sinnvoll
sein, d.h., man kann ein Leistungsmerkmal nicht halb implementieren und
schon ausliefern, um den Entwicklungszeitraum zu verkürzen.
Es ist viel besser, jeweils nur ein oder zwei Monate im Voraus zu planen als sechs
Monate oder ein Jahr. Eine Firma, die ihren Kunden eine umfangreiche Software
liefert, kann diese Software m öglicherweise nicht h äufig durch neue Versionen
aktualisieren. Trotzdem sollte auch in diesem Fall versucht werden, den Entwick-
lungszyklus zu verkürzen.
Metapher
Jedes XP-Softwareprojekt wird durch eine übergreifende Metapher geleitet. Diese
Metapher ist gelegentlich »naiv«, wie ein Vertragsmanagementsystem, über das
man in Form von Vertr ägen, Kunden und Unterzeichnungen spricht. Gelegent-
lich muss eine Metapher n äher erläutert werden, wie z.B. die Aussagen, dass ein
Computer als Arbeitsplatz dargestellt werden sollte oder dass die Rentenberech-
nung einer Tabellenkalkulation gleicht. Es handelt sich um Metaphern, da wir
die Aussage nicht w örtlich, sondern im übertragenen Sinn verstehen. Die Meta-
pher soll es allen Beteiligten lediglich erleichtern, die grundlegenden Bestand-
teile und deren Beziehungen zueinander zu verstehen.
Technische Komponenten sollten im Kontext der gew ählten Metapher stimmig
beschrieben werden. Die n ähere Besch äftigung mit der Metapher kann das
gesamte Team zu neuen Ideen anregen.
In XP ersetzt die Metapher einen Großteil dessen, was sonst häufig als »Architek-
tur« bezeichnet wird. Die Vogelperspektive eines Systems Architektur zu nennen
ist problematisch, insofern man bei diesem Ansatz nicht gezwungen wird, das
System als in sich stimmige Einheit zu betrachten. Eine Architektur stellt ledig-
lich die Grundkomponenten und deren Verbindungen zueinander dar.
Sie könnten jetzt einwenden, dass eine schlecht entworfene Architektur nat ür-
lich nichts taugt. Wir müssen uns auf das Ziel der Architektur konzentrieren, das
darin besteht, allen Beteiligten ein schl üssiges Modell zur Verf ügung zu stellen,
--- PAGE 77 ---
 Einfaches Design 57
mit dem sie arbeiten k önnen und das sowohl f ür die Geschäftsleute als auch für
die Techniker brauchbar ist. Wir fordern eine Metapher, da wir dann eher eine
Architektur erhalten, die sich einfach vermitteln und ausarbeiten lässt.
Einfaches Design
Das zu jedem Zeitpunkt richtige Design f ür die Software zeichnet sich durch die
folgenden Merkmale aus:
1. Es besteht alle Tests.
2. Es enth ält keine Redundanzen. H üten Sie sich vor versteckten Redundanzen
wie parallelen Klassenhierarchien.
3. Es legt offen, was die Programmierer intendieren.
4. Es hat die geringste m ögliche Anzahl von Klassen und Methoden.
Jeder Teil des Designs eines Systems muss sein Vorhandensein gem äß dieser Kri-
terien rechtfertigen k önnen. Edward Tufte 1 beschreibt eine Übung für Grafiker:
Entwerfen Sie eine beliebige Grafik. Radieren Sie dann alles weg, was keine Infor-
mationen enthält. Was übrig bleibt, ist das richtige Design f ür die Grafik. Einfa-
ches Design funktioniert so: Entfernen Sie alle Designelemente, die Sie entfernen
können, ohne Regel 1, 2 und 3 zu verletzen. Dieser Rat ist dem entgegengesetzt,
was Sie sonst immer zu h ören bekommen: »Für heute implementieren, für mor-
gen entwerfen.« Wenn Sie glauben, dass zuk ünftige Belange unsicher sind und
dass Sie Ihre Meinung ändern können, ohne immense Kosten zu verursachen,
dann w äre es verr ückt, Funktionen zu implementieren, die auf Spekulationen
beruhen. Implementieren Sie das, was Sie brauchen, genau in dem Moment, in
dem Sie es brauchen.
Testen
Eine Programmeigenschaft, f ür die es keinen automatisierten Test gibt, existiert
einfach nicht. Programmierer schreiben Komponententests, damit ihr Vertrauen
in die Funktionst üchtigkeit des Programms Teil des Programms selbst werden
kann. Kunden schreiben Funktionstests, damit ihr Vertrauen in die Funktions-
tüchtigkeit des Programms zu einem Teil des Programms werden kann. Ergebnis
ist ein Programm, das mit der Zeit immer vertrauensw ürdiger wird – und immer
mehr (statt weniger) fähig wird, Änderungen anzunehmen.
1. Edward Tufte, The Visual Display of Quantative Information, Graphics Press, 1992
--- PAGE 78 ---
58 10 Kurzer Überblick
Sie müssen nicht für jede Methode, die Sie programmieren, einen Test schreiben,
sondern nur f ür Produktionsmethoden, die m öglicherweise nicht funktionieren
könnten. Gelegentlich möchten Sie einfach herausfinden, ob etwas m öglich ist.
Sie untersuchen dies eine halbe Stunde lang. Ja, stellen Sie fest, es ist m öglich.
Dann werfen Sie Ihren Code weg und beginnen erneut mit dem Schreiben von
Tests.
Refactoring
Beim Implementieren einer Programmfunktion fragen die Programmierer
immer, ob es eine M öglichkeit gibt, das vorhandene Programm zu ändern, um
das Hinzufügen der Funktion zu vereinfachen. Nachdem sie die Funktion hinzu-
gefügt haben, fragen die Programmierer, ob es nun M öglichkeiten gibt, das Pro-
gramm zu vereinfachen und gleichzeitig alle Tests auszuf ühren. Dieser Vorgang
wird Refactoring genannt.
Dies bedeutet, dass Sie manchmal mehr als das absolut Notwendige tun m üssen,
um ein Leistungsmerkmal zum Laufen zu bringen. Durch diese Vorgehensweise
lässt sich jedoch sicherstellen, dass Sie die weiteren Leistungsmerkmale mit
annehmbarem Aufwand hinzuf ügen können. Das Refactoring basiert allerdings
nicht auf Spekulation, sondern geschieht dann, wenn das System es erfordert.
Wenn das System Sie dazu zwingt, Code zu duplizieren, dann ist ein Refactoring
erforderlich.
Wenn ein Programmierer eine unschöne Möglichkeit sieht, einen Test innerhalb
einer Minute zum Laufen zu bringen, und eine andere M öglichkeit, die zehn
Minuten erfordert und den Test durch ein einfacheres Design zum Laufen bringt,
dann ist es richtig, die zehn Minuten aufzubringen. Gl ücklicherweise kann man
sogar radikale Änderungen am Design eines Systems in kleinen, wenig riskanten
Schritten durchführen.
Programmieren in Paaren
Der gesamte Produktionscode wird von jeweils zwei Leuten geschrieben, die mit
einer Tastatur und einer Maus an einem Rechner arbeiten.
Die beiden nehmen dabei zwei verschiedene Rollen ein. Ein Partner, derjenige
mit der Tastatur und der Maus, denkt dar über nach, wie sich eine Methode hier
und jetzt am besten implementieren l ässt. Der andere Partner denkt strategi-
scher:
--- PAGE 79 ---
 Gemeinsame Verantwortlichkeit 59
 Kann der gesamte Ansatz funktionieren?
 Welche anderen Testfälle gibt es, die m öglicherweise noch nicht funktionie-
ren?
 Gibt es eine M öglichkeit, das gesamte System so weit zu vereinfachen, dass
sich das aktuelle Problem wie von selbst löst?
Paare sind veränderlich. Daher ist es durchaus m öglich, dass zwei Personen, die
sich morgens zusammentun, am Nachmittag mit anderen Partnern arbeiten.
Wenn Sie für eine Aufgabe in einem Bereich verantwortlich sind, der Ihnen nicht
vertraut ist, dann k önnen Sie jemanden, der Erfahrung im betreffenden Bereich
hat, fragen, ob er Ihr Partner werden m öchte. Häufiger ist es aber so, dass sich
jedes Teammitglied als Partner eignet.
Gemeinsame Verantwortlichkeit
Von jedem, der eine M öglichkeit sieht, irgendeinem Teil des Codes etwas Sinn-
volles hinzuzufügen, wird erwartet, dass er dies jederzeit tut.
Stellen Sie dies den beiden anderen Modellen von Verantwortlichkeit f ür den
Code gegenüber: keine Verantwortlichkeit und individuelle Verantwortlichkeit.
Früher war niemand f ür ein bestimmtes Codesegment verantwortlich. Wenn
jemand irgendetwas am Code ändern wollte, dann tat er dies, um den eigenen
Zwecken zu genügen, ungeachtet dessen, ob sich dies mit dem bereits vorhande-
nen Code vertrug oder nicht. Dies f ührte zu Chaos, insbesondere wenn Objekte
involviert waren, bei denen sich nicht so einfach statisch bestimmen l ässt, wie
eine Codezeile in einem Teil des Codes mit einer Codezeile in einem anderen
Teil des Codes zusammenh ängt. Der Code wuchs rasch an, wurde aber genauso
schnell instabil.
Um das unter Kontrolle zu bekommen, f ührte man die individuelle Verantwort-
lichkeit ein. Derjenige, der ein bestimmtes Codesegment ändern konnte, war
dafür auch offiziell verantwortlich. Wenn ein anderer der Meinung war, dass
Code geändert werden sollte, dann musste er diese Änderung von dem f ür den
Code Verantwortlichen anfordern. Folge dieses strikten Modells ist, dass der
Code den Kenntnisstand des Teams nicht widerspiegelt, da man den f ür den
Code Verantwortlichen nicht gerne stört. Man braucht die Änderung schließlich
sofort und nicht später. Der Code bleibt daher stabil und entwickelt sich nicht so
schnell weiter, wie dies w ünschenswert w äre. Dann verl ässt der f ür den Code
Verantwortliche die Firma ...
--- PAGE 80 ---
60 10 Kurzer Überblick
In XP übernimmt jeder Verantwortung f ür das gesamte System. Nicht jeder
kennt jeden Teil des Systems gleicherma ßen gut, obwohl jeder etwas über jeden
Teil weiß. Wenn ein Programmiererpaar bei der Arbeit ist und eine M öglichkeit
sieht, den Code zu verbessern, dann f ührt es diese Verbesserung durch, wenn
dadurch die Arbeit erleichtert wird.
Fortlaufende Integration
Der Code wird nach einigen Stunden integriert und getestet – zumindest nach
einem Tag Entwicklungsarbeit. Eine einfache M öglichkeit, dies durchzuf ühren,
besteht darin, einen eigenen Integrationsrechner bereitzustellen. Wenn dieser
Rechner frei ist, setzt sich das Programmiererpaar, dessen Code integriert werden
soll, dorthin, lädt die aktuelle Version und dann seine Änderungen (wobei es den
Code nach Konflikten überprüft und diese ggf. behebt) und anschlie ßend führt
es so lange Tests aus, bis diese völlig (100%) fehlerfrei ablaufen.
Jeweils einen Satz von Änderungen zu integrieren funktioniert gut, da es dann
offensichtlich ist, wer einen fehlgeschlagenen Test korrigieren muss – schließlich
hat das letzte Programmiererpaar die Tests voll funktionsf ähig hinterlassen.
Wenn wir die Tests nicht v öllig (100%) fehlerfrei ausf ühren können, dann soll-
ten wir das, was wir programmiert haben, wegwerfen und von vorn beginnen, da
wir offensichtlich nicht genug wussten, um dieses Leistungsmerkmal program-
mieren zu können (aber wir wissen jetzt wahrscheinlich genug).
40-Stunden-Woche
Ich möchte jeden Tag frisch und tatkr äftig beginnen und m üde und zufrieden
beschließen. Am Freitag m öchte ich so m üde und zufrieden sein, dass ich mich
darauf freue, zwei Tage mit etwas anderem als Arbeit zu verbringen. Am Montag
möchte ich dann voller Begeisterung und neuer Ideen wieder ins Büro kommen.
Ob sich diese Vorstellung in eine Arbeitswoche von genau 40 Stunden überset-
zen l ässt, ist nicht so wahnsinnig wichtig. Jeder hat eine andere Belastungs-
grenze. Einer mag 35 Stunden konzentriert arbeiten können und ein anderer 45.
Niemand kann jedoch über viele Wochen hinweg 60 Stunden in der Woche
arbeiten und dann immer noch frisch, kreativ, sorgf ältig und voller Selbstver-
trauen sein. Arbeiten Sie nicht so.
Überstunden sind ein Symptom für ein ernstes Problem im Projekt. Die XP-Regel
ist einfach: Man darf nicht zwei Wochen hintereinander Überstunden machen.
Überstunden innerhalb einer Woche sind akzeptabel. Wenn Sie dann am n ächs-
--- PAGE 81 ---
 Kunde vor Ort 61
ten Montag zur Arbeit kommen und sagen: »Um unser Ziel zu erreichen, müssen
wir heute wieder l änger arbeiten«, dann liegt bereits ein Problem vor, das sich
nicht durch Überstunden lösen lässt.
Ein damit verwandtes Thema ist der Urlaub. Europ äer nehmen häufig zwei, drei
oder gar vier Wochen Urlaub am St ück. Amerikaner nehmen selten mehr als
einige Tage Urlaub. Wenn es meine Firma wäre, dann würde ich darauf bestehen,
dass jeder einen zweiwöchigen Urlaub pro Jahr nimmt und mindestens noch ein
oder zwei weitere Wochen Urlaub für kürzere Pausen zur Verfügung hat.
Kunde vor Ort
Ein echter Kunde muss mit dem Team zusammenarbeiten und verf ügbar sein,
um Fragen zu beantworten, Streitpunkte zu klären und Prioritäten zu setzen. Mit
»echter Kunde « meine ich denjenigen, der das System tats ächlich verwenden
wird, nachdem es in Betrieb genommen wurde. Wenn Sie an einem Kunden-
dienstsystem arbeiten, dann ist der Kunde ein Kundendienstmitarbeiter. Arbei-
ten Sie an einem System zum Verkauf von Investmentfonds, dann ist der Kunde
ein Fondsmakler.
Ein gewichtiger Einwand gegen diese Regel ist, dass echte Benutzer des in Ent-
wicklung befindlichen Systems zu teuer sind, um sie dem Team zur Verfügung zu
stellen. Manager m üssen in diesem Fall entscheiden, was mehr wert ist – eine
Software, die schneller fertig gestellt wird und besser arbeitet, oder die Arbeit von
ein oder zwei Leuten. Falls das Unternehmen von der Software nicht mehr profi-
tiert als von der Arbeitskraft eines Mitarbeiters, dann sollte dieses System viel-
leicht gar nicht produziert werden.
Es ist ja auch nicht so, dass der dem Team zur Verf ügung stehende Kunde sonst
keine Arbeit erledigen könnte. Sogar Programmierer sind nicht in der Lage, jede
Woche 40 Stunden lang Fragen zu stellen. Der Kunde vor Ort ist zwar physisch
von den anderen Kunden getrennt, wird aber wahrscheinlich gen ügend Zeit
haben, seiner üblichen Arbeit nachzugehen.
Der Nachteil eines Kunden vor Ort besteht in der M öglichkeit, dass der Kunde
den Programmierern hunderte von Stunden hilft und das Projekt dann einge-
stellt wird. In diesem Fall geht die Arbeit verloren, die der Kunde vor Ort geleistet
hat, und man hat auch die Arbeitszeit verloren, die der Kunde anderweitig h ätte
zubringen können, wenn er nicht an einem gescheiterten Projekt mitgearbeitet
hätte. XP setzt alles daran, damit ein Projekt nicht scheitert.
--- PAGE 82 ---
62 10 Kurzer Überblick
Ich habe an einem Projekt mitgearbeitet, in dem man uns widerwillig einen Kun-
den zur Verf ügung stellte, allerdings »nur für kurze Zeit «. Nachdem das System
erfolgreich ausgeliefert wurde und offensichtlich in der Lage war, sich weiterzu-
entwickeln, gaben uns die Manager von der Seite der Kunden drei echte Kunden.
Die Firma hätte mit etwas höherem Einsatz weit mehr von dem System profitie-
ren können.
Programmierstandards
Wenn man eine Menge Programmierer hat, die von diesem Teil des Systems zu
einem anderen Teil wechseln, die mehrmals t äglich mit anderen Partnern arbei-
ten und den Code anderer Programmierer ständig überarbeiten, dann kann man
es sich einfach nicht leisten, mit unterschiedlichen Programmierstilen zu arbei-
ten. Man sollte nach einer gewissen Einarbeitungszeit nicht mehr feststellen kön-
nen, welches Teammitglied welchen Code geschrieben hat.
Der Standard sollte gemäß der Regel »einmal und nur einmal« (kein redundanter
Code) die geringste Menge an Programmieraufwand fordern. Der Standard sollte
die Kommunikation f ördern. Der Standard muss vom gesamten Team freiwillig
eingehalten werden.
--- PAGE 83 ---
11 Wie kann das funktionieren?
Die Verfahren unterstützen einander gegenseitig. Die Schwäche eines Verfahrens wird
durch die Stärken der anderen ausgeglichen.
Moment mal. Keine der zuvor beschriebenen Verfahren ist einmalig oder noch nie
da gewesen. Diese Verfahren sind alle schon so lange in Verwendung, wie es Pro-
gramme zu schreiben gibt. Die meisten dieser Verfahren wurden zu Gunsten kom-
plizierterer, aufwändigerer Verfahren aufgegeben, als ihre Schwächen offenbar
wurden. Ist XP dann nicht ein simplifizierender Ansatz der Softwareentwicklung?
Bevor wir fortfahren, wollen wir uns davon überzeugen, dass uns diese einfachen
Verfahren nicht schaden, so wie sie Softwareprojekte vor einigen Jahrzehnten ge-
schadet haben.
Da die exponentielle Kurve der Änderungskosten hinfällig geworden ist, kom-
men all diese Verfahren wieder ins Spiel. Jedes dieser Verfahren weist immer
noch die gleichen Schwächen wie früher auf- aber was passiert, wenn diese
Schwächen jetzt durch die Stärken der anderen Verfahren ausgeglichen werden?
Wir können dann damit durchkommen, mit einfachen Verfahren zu arbeiten.
Dieses Kapitel stellt die Verfahren aus einer anderen Perspektive dar, indem wir
uns darauf konzentrieren, wodurch ein Verfahren für gewöhnlich unhaltbar
wird, und zeigen, wie die anderen Verfahren dafür sorgen, dass die nachteiligen
Effekte anderer Verfahren im Projekt nicht überhand nehmen. Dieses Kapitel
zeigt zudem, wie die ganze XP-Geschichte möglicherweise funktionieren kann.
Das Planungsspiel
Man kann unmöglich mit der Entwicklung beginnen, wenn man nur einen gro-
ben Plan hat. Man kann den Plan nicht fortwährend aktualisieren; das würde zu
lange dauern und die Kunden verärgern. Es sei denn:
 Die Kunden aktualisieren den Plan selbst anhand der Aufwandsschätzungen
der Programmierer.
 Sie haben anfangs einen Plan, der ausreicht, um den Kunden einen groben Ein-
druck davon zu vermitteln, was über die nächsten Jahre hinweg möglich ist.
 Sie arbeiten mit kurzen Releasezyklen, sodass sich im Plan vorhandene Fehler
höchstens einige Wochen oder Monate lang auswirken können.
 Ihr Kunde ist Teil des Teams, damit er rasch potenzielle Veränderungen und
Verbesserungsmöglichkeiten erkennen kann.
--- PAGE 84 ---
64 11 Wie kann das funktionieren?
Unter diesen Umständen könnte man die Entwicklung mit einem einfachen Plan
beginnen und diesen Plan im weiteren Verlauf fortwährend weiter ausarbeiten.
Kurze Releasezyklen
Man kann unmöglich nach einigen wenigen Monaten in die Produktion gehen.
Man kann sicherlich keine neuen Systemversionen in Zyklen erstellen, die von
ein paar Tagen bis zu einigen Monaten reichen. Es sei denn:
 Das Planungsspiel erm öglicht es Ihnen, an den wertvollsten Leistungsmerk-
malen zu arbeiten, sodass sogar ein kleines System Gewinn bringend f ür das
Unternehmen ist.
 Sie integrieren fortlaufend, sodass die Kosten für die Herausgabe einer Version
minimal sind.
 Tests verringern die Fehlerrate in einem Ma ße, dass die Software keine lange
Testphase durchlaufen muss, bevor man sie freigeben kann.
 Sie finden ein einfaches Design, das f ür diese Version ausreichend ist, aber
nicht für alle Zeiten.
Unter diesen Umständen könnte man kleine Releases erstellen und nach kürzerer
Entwicklungszeit liefern.
Metapher
Man kann die Entwicklung unmöglich beginnen, wenn man nur eine Metapher
hat. Eine Metapher ist nicht detailliert genug und kann zudem falsch sein. Es sei
denn:
 Man erhält durch realen Code und Tests ein unmittelbares Feedback dar über,
ob die Metapher funktioniert.
 Der Kunde ist damit einverstanden, unter Verwendung einer Metapher über
das System zu reden.
 Man setzt Refactoring ein, um sein Verst ändnis davon, was die Metapher in
der Praxis bedeutet, fortlaufend zu verbessern.
Unter diesen Umst änden k önnte man die Entwicklung beginnen, auch wenn
man nur eine Metapher hat.
--- PAGE 85 ---
 Einfaches Design 65
Einfaches Design
Das Design darf für den heutigen Code nicht gerade mal ausreichen. Man würde
sich mit dem Design in eine Sackgasse man övrieren und wäre dann nicht mehr
in der Lage, das System weiterzuentwickeln. Es sei denn:
 Refactoring gehört zur täglichen Praxis, sodass man sich nicht davor scheut,
Änderungen vorzunehmen.
 Man hat eine klare allgemeine Metapher, sodass man sicher sein kann, dass
künftige Designänderungen einem konvergenten Pfad folgen.
 Man programmiert mit einem Partner, sodass man darauf vertrauen kann, ein
einfaches Design und kein dummes Design zu entwerfen.
Unter diesen Umständen könnte man es sich leisten, ein möglichst gutes Design
für heute zu entwerfen.
Testen
Man kann unmöglich alle diese Tests schreiben. Es w ürde zu lange dauern. Pro-
grammierer schreiben keine Tests. Es sei denn:
 Das Design ist so einfach wie m öglich gehalten, sodass das Schreiben von
Tests nicht schwierig ist.
 Man programmiert mit einem Partner, sodass der Partner weitermachen
kann, wenn einem keine Tests mehr einfallen. Und wenn der Partner keine
Tests mehr schreiben will, kann man die Tastatur übernehmen und selbst
weitermachen.
 Man ist zufrieden, wenn alle Tests funktionieren.
 Der Kunde ist mit dem System zufrieden, wenn er sieht, dass alle Tests funkti-
onieren.
Unter diesen Umst änden könnten Programmierer und Kunden Tests schreiben.
Nebenbei bemerkt: Wenn Sie keine automatisierten Tests schreiben, funktioniert
der Rest von XP nicht annähernd so gut.
Refactoring
Man kann unm öglich das Design eines Systems fortw ährend überarbeiten. Das
würde zu lange dauern, wäre zu schwer zu kontrollieren und würde höchstwahr-
scheinlich das System lahm legen. Es sei denn:
--- PAGE 86 ---
66 11 Wie kann das funktionieren?
 Man ist daran gew öhnt, gemeinsame Verantwortlichkeit (engl. collective
ownership) zu übernehmen, sodass es einem nichts ausmacht, dann Ände-
rungen vorzunehmen, wenn sie erforderlich sind.
 Man verf ügt über Programmierstandards, sodass man vor dem Refactoring
den Code nicht umformatieren muss.
 Man programmiert in Paaren, sodass man wahrscheinlich eher den Mut hat,
eine schwierige Refactoring-Aufgabe anzugehen, und weniger wahrscheinlich
Schaden anrichtet.
 Man hat Tests, sodass es weniger wahrscheinlich ist, dass man etwas besch ä-
digt, ohne es zu merken.
 Man hat ein einfaches Design, sodass das Refactoring einfacher durchzuf üh-
ren ist.
 Man integriert das System fortw ährend, sodass man innerhalb weniger Stun-
den weiß, ob man versehentlich etwas an einem anderen Teil der Software
beschädigt hat oder ob das eigene Refactoring im Widerspruch zur Arbeit
eines anderen Programmierers steht.
 Man ist ausgeruht, sodass man mutiger ist und weniger wahrscheinlich Fehler
macht.
Unter diesen Umst änden k önnte man das System immer dann überarbeiten,
wenn man eine Möglichkeit sieht, das System zu vereinfachen, Redundanzen zu
entfernen oder klarer zu kommunizieren.
Programmieren in Paaren
Man kann unm öglich den gesamten Produktionscode paarweise schreiben. Das
dauert zu lange. Und was passiert, wenn zwei Programmierer sich einfach nicht
verstehen? Es sei denn:
 Die Programmierstandards reduzieren Reibereien.
 Jeder ist frisch und ausgeruht, wodurch sich die Wahrscheinlichkeit verrin-
gert, dass es zu unfruchtbaren Diskussionen kommt.
 Die Paare schreiben gemeinsam Tests, was den einzelnen Programmierern die
Möglichkeit gibt, ihr Verst ändnis mit dem anderer Programmierer abzustim-
men, bevor sie mit der Implementierung beginnen.
--- PAGE 87 ---
 Gemeinsame Verantwortlichkeit 67
 Die Paare k önnen ihre Entscheidungen bez üglich der Benennung und des
grundlegenden Designs an der Metapher ausrichten.
 Die Paare arbeiten mit einem einfachen Design, sodass beide Programmierer
wissen, was vor sich geht.
Unter diesen Umst änden könnte man den gesamten Produktionscode von Paa-
ren schreiben lassen. Nebenbei bemerkt: Wenn man allein programmiert, macht
man eher Fehler, entscheidet man sich eher f ür ein zu kompliziertes Design und
ist eher geneigt, die anderen Verfahren nicht zu beachten, insbesondere wenn
man unter Druck steht.
Gemeinsame Verantwortlichkeit
Man kann unm öglich zulassen, dass potenziell jeder jeden beliebigen Teil des
Systems ändern kann. Dies w ürde dazu f ühren, dass st ändig etwas besch ädigt
wird und dass die Kosten für die Integration drastisch ansteigen. Es sei denn:
 Man integriert in so kurzen Zeitintervallen, dass das Risiko von Konflikten
dadurch gemindert wird.
 Man schreibt Tests und f ührt diese durch, sodass das Risiko, versehentlich
etwas zu beschädigen, geringer wird.
 Man programmiert paarweise, sodass es weniger wahrscheinlich ist, dass ein
Programmierer den Code beschädigt, und die Programmierer schneller lernen
können, was sich nutzbringend ändern lässt.
 Man h ält Programmierstandards ein, sodass man sich nicht in Kleinkriege
über Programmierkonventionen verstrickt.
Unter diesen Umst änden könnte man zulassen, dass jeder jeden beliebigen Teil
des Systems ändern kann, wenn er eine Möglichkeit sieht, das System zu verbes-
sern. Nebenbei bemerkt: Das Design wird sehr viel langsamer weiterentwickelt,
wenn die Programmierer nicht gemeinsam verantwortlich sind.
Fortlaufende Integration
Man kann unm öglich nach einigen Stunden Arbeit das System bereits integrie-
ren. Die Integration dauert viel zu lange und es gibt zu viele Konflikte und M ög-
lichkeiten, versehentlich etwas zu beschädigen. Es sei denn:
--- PAGE 88 ---
68 11 Wie kann das funktionieren?
 Man kann rasch Tests ausführen, sodass man sicher sein kann, nichts beschä-
digt zu haben.
 Man programmiert paarweise, sodass nur halb so viele verschiedene Ände-
rungsstränge integriert werden müssen.
 Man nutzt das Refactoring, sodass es mehr kleinere Komponenten gibt und
die Wahrscheinlichkeit von Konflikten verringert wird.
Unter diesen Umst änden könnte man nach einigen wenigen Stunden integrie-
ren. Nebenbei bemerkt: Wenn man nicht rasch integriert, dann w ächst die
Wahrscheinlichkeit potenzieller Konflikte und die Kosten für die Integration stei-
gen stark an.
40-Stunden-Woche
Man kann unmöglich eine 40-Stunden-Woche einhalten. Man kann in 40 Stun-
den nicht profitabel genug arbeiten. Es sei denn:
 Das Planungsspiel zeigt, wie man profitablere Arbeit leisten kann.
 Die Kombination von Planungsspiel und Testen reduziert die H äufigkeit, mit
der sich unangenehme Überraschungen einstellen, die Ihnen mehr Arbeit
bescheren, als Ihnen lieb ist.
 Die Verfahren helfen, mit optimaler Geschwindigkeit zu programmieren,
sodass man gar nicht schneller arbeiten kann.
Unter diesen Umst änden könnte man in 40-Stunden-Wochen profitabel genug
arbeiten. Nebenbei bemerkt: Wenn das Team nicht frisch und energiegeladen
bleibt, dann kann es die übrigen Verfahren nicht anwenden.
Kunde vor Ort
Man kann unm öglich einen echten Kunden in das Team aufnehmen, der die
ganze Zeit zugegen ist. Der Kunde kann an anderer Stelle viel nutzbringender für
das Unternehmen eingesetzt werden. Es sei denn:
 Der Kunde kann einen wertvollen Beitrag zum Projekt leisten, indem er Funk-
tionstests schreibt.
 Der Kunde kann f ür das Projekt von Nutzen sein, indem er f ür die Program-
mierer in kleinem Rahmen Entscheidungen über Priorit äten und Umfang
fällt.
--- PAGE 89 ---
 Programmierstandards 69
Unter diesen Umständen könnte der Kunde als Teammitglied nutzbringender für
die Firma sein. Nebenbei bemerkt: Wenn in dem Team kein Kunden ist, muss es
zusätzliche Risiken eingehen, insofern es langfristiger plant und programmiert,
ohne genau zu wissen, welche Tests bestanden werden müssen und welche Tests
ignoriert werden können.
Programmierstandards
Man kann unmöglich vom Team fordern, nach einem gemeinsamen Standard zu
programmieren. Programmierer sind eingefleischte Individualisten und w ürden
eher kündigen, als ihre geschweiften Klammern an einer anderen Stelle einzuf ü-
gen. Es sei denn:
 XP macht es wahrscheinlicher, dass die Programmierer Teil eines erfolgrei-
chen Teams sind.
Unter diesen Umst änden sind die Programmierer vielleicht bereit, ihren Stil
etwas anzupassen. Nebenbei bemerkt: H ält man sich nicht an Programmierstan-
dards, dann wird das Programmieren in Paaren und das Refactoring durch die
unterschiedlichen Programmierstile merklich verlangsamt.
Schlussfolgerung
Jedes der oben genannten Verfahren funktioniert f ür sich allein genommen
nicht besonders gut (das Testen bildet hier m öglicherweise eine Ausnahme).
Diese Verfahren erfordern andere Verfahren, die sie in der Balance halten. Abbil-
dung 11.1 zeigt ein Diagramm, das die Verfahren zusammenfasst. Wenn zwei
Verfahren durch eine Linie miteinander verbunden sind, dann hei ßt dies, dass
sie sich gegenseitig verst ärken. Ich wollte diese Abbildung nicht an den Anfang
des Kapitels stellen, da XP darin kompliziert erscheint. Die einzelnen Teile sind
einfach. Der Gehalt ergibt sich aus der Interaktion der Teile.
--- PAGE 90 ---
70 11 Wie kann das funktionieren?
Abbildung 11.1  Die Verfahren stützen sich gegenseitig.
--- PAGE 91 ---
12 Managementstrategie
Wir werden das gesamte Projekt nach den Grundregeln der Geschäftsführung verwalten –
in Phasen gestaffelte Auslieferung, schnelle und konkrete Rückmeldung, klare Artikula-
tion der geschäftlichen Anforderungen an das System und Spezialisten für spezielle Aufga-
ben.
Das Managementdilemma: Einerseits möchte man, dass der Manager sämtliche
Entscheidungen fällt. Es gibt keine unnötige Kommunikation, da man es nur mit
einer Person zu tun hat. Es gibt eine Person, die gegenüber dem höheren
Management verantwortlich ist. Es gibt eine Person, die die Vision verfolgt. Nie-
mand sonst muss darüber informiert sein, da sämtliche Entscheidungen von
einer Person getroffen werden.
Wir wissen, dass diese Strategie nicht funktioniert, da kein Einzelner genug wis-
sen kann, um in jeder Hinsicht die richtigen Entscheidungen fällen zu können.
Managementstrategien, die auf eine zentrale Kontrolle abzielen, sind zudem
schwierig umzusetzen, da sie aufseiten derjenigen, die verwaltet werden, eine
Menge Zusatzaufwand fordern.
Andererseits funktioniert auch die umgekehrte Strategie nicht. Man kann nicht
einfach jeden schalten und walten lassen, ohne einen Überblick zu haben. Es ist
unvermeidlich, dass an Reibungspunkten Konflikte entstehen. Jemand muss das
Projekt aus einer übergeordneten Perspektive betrachten und das Projekt beein-
flussen können, wenn es vom Kurs abkommt.
Wir kommen hier wieder auf die Prinzipien zurück, die uns dabei helfen können,
einen Weg zwischen diesen beiden Extremen zu finden:
 Verantwortung übernehmen – legt nahe, dass es in der Verantwortung der
Manager liegt aufzuzeigen, was zu tun ist, statt Aufgaben zu verteilen.
 Qualitätsarbeit – legt nahe, dass die Beziehung zwischen Managern und Pro-
grammierern auf Vertrauen basieren muss, da die Programmierer gute Arbeit
leisten wollen. Andererseits heißt dies nicht, dass die Manager nichts zu tun
haben. Allerdings besteht ein großer Unterschied zwischen »Ich versuche,
diese Leute dazu zu bringen, gute Arbeit zu leisten« und »Meine Aufgabe ist
es, den Leuten zu helfen, noch bessere Arbeit leisten zu können.«
 Inkrementelle Veränderungen – legen nahe, dass der Manager das gesamte
Projekt lenkend begleitet, statt zu Beginn einfach ein umfangreiches Verfah-
renshandbuch auszuteilen.
--- PAGE 92 ---
72 12 Managementstrategie
 An örtliche Gegebenheiten anpassen – legt nahe, dass dem Manager eine füh-
rende Rolle darin zukommt, XP an die örtlichen Gegebenheiten anzupassen
und herauszufinden, ob die XP-Kultur sich mit der Firmenkultur verträgt, und
schließlich eine Möglichkeit zu suchen, etwaige Konflikte zu lösen.
 Mit leichtem Gep äck reisen – legt nahe, dass der Manager wenig Zusatzauf-
wand verursacht, wie lange Meetings mit allen Beteiligten, lange Statusbe-
richte. Was immer der Manager von den Programmierern fordert, sollte nicht
allzu viel Zeit erfordern.
 Ehrliches Messen – legen nahe, dass der Manager Messwerte sammelt, die
einen realistischen Genauigkeitsgrad haben. Man versucht nicht, jede
Sekunde zu rechtfertigen, wenn die Uhr nur einen Minutenzeiger, aber kei-
nen Sekundenzeiger hat.
Die Strategie, die sich aus dieser Bewertung ergibt, ähnelt eher einer dezentrali-
sierten Entscheidungsfindung als einer zentralisierten Kontrolle. Aufgabe des
Managers ist es, das Planungsspiel zu leiten, Messdaten zu sammeln, sicherzustel-
len, dass diejenigen die Messdaten zu Gesicht bekommen, deren Arbeit gemessen
wird, und gelegentlich in Situationen zu intervenieren, die sich nicht auf dezent-
ralisierte Weise lösen lassen.
Messdaten
Messdaten sind das grundlegende XP-Managementtool. Das Verhältnis zwischen
geschätzter Entwicklungszeit und Kalenderzeit ist das Grundma ß für die Durch-
führung des Planungsspiels. Das Team kann damit die Projektgeschwindigkeit
festlegen. Wird das Verhältnis größer (weniger Kalenderzeit für einen gegebenen
geschätzten Entwicklungsaufwand), dann kann dies bedeuten, dass der Teampro-
zess gut funktioniert. Es kann aber auch bedeuten, dass das Team nicht genügend
tut (wie z.B. Refactoring und paarweises Arbeiten), au ßer Anforderungen zu
erfüllen, und dass dies auf lange Sicht gesehen auf Kosten des Projekts geht.
Das Medium für die Messdaten ist eine gro ße, für alle sichtbare Schautafel. Statt
jedem eine E-Mail-Nachricht zu senden, aktualisiert der Manager diese Schautafel
regelmäßig (mindestens einmal w öchentlich). H äufig gen ügt das schon. Sie
haben den Eindruck, es werden nicht gen ügend Tests geschrieben? Zeichnen Sie
ein Diagramm mit der Anzahl der Tests und aktualisieren Sie es täglich.
Arbeiten Sie nicht mit allzu vielen Messdaten und seien Sie bereit, Messdaten
auszurangieren, die ihren Zweck erfüllt haben. Ein Team kann in der Regel nicht
mehr als drei bis vier Maße gleichzeitig verkraften.
--- PAGE 93 ---
 Coaching 73
Messdaten werden mit der Zeit schal. Insbesondere Messdaten, die sich 100%
nähern, sind wahrscheinlich wenig nützlich. Dieser Ratschlag trifft nicht auf die
Trefferquote der Komponententests zu, die 100% sein muss, aber diese Treffer-
quote ist eigentlich eher eine Voraussetzung als ein Ma ß. Sie k önnen sich auch
nicht darauf verlassen, dass eine Trefferquote von 97% bei den Funktionstest
bedeutet, dass nur noch 3% der Arbeit vor Ihnen liegt. Wenn sich ein Maß 100%
nähert, dann ersetzen Sie es durch ein anderes, das sich noch im einstelligen
Bereich befindet.
Das soll nicht heißen, dass Sie ein XP-Projekt anhand von Zahlen verwalten kön-
nen. Die Zahlen stellen eine M öglichkeit dar, sanft und unaufdringlich die Not-
wendigkeit von Ver änderungen mitzuteilen. Das empfindlichste Barometer des
XP-Managers für die Notwendigkeit von Änderungen besteht darin, sich der eige-
nen Gefühle bewusst zu sein. Wenn Sie morgens mit flauem Magen zur Arbeit
fahren, dann stimmt etwas nicht mit Ihrem Projekt und es ist Ihre Aufgabe, eine
Änderung herbeizuführen.
Coaching
Was sich die meisten Leute unter Management vorstellen, ist in XP auf zwei Rollen
aufgeteilt: der des Coachs und des Terminmanagers (diese Rollen k önnen auch
von einer Person übernommen werden). Der Coach ist primär mit der technischen
Ausführung (und Weiterentwicklung) des Prozesses beschäftigt. Der ideale Coach
kann gut kommunizieren, ist nicht leicht aus der Ruhe zu bringen, verf ügt über
technische Kenntnisse (obwohl dies kein absolutes Muss ist) und ist zuversicht-
lich. Man wird häufig denjenigen als Coach einsetzen, der in anderen Teams die
Rolle des leitenden Programmierers oder Systemarchitekten einnehmen w ürde.
Die Rolle des Coachs in XP unterscheidet sich von diesen jedoch stark.
Die Ausdr ücke »leitender Programmierer « oder »Systemarchitekt« beschw ören
Bilder von einsamen Genies herauf, die wichtige Entscheidungen im Projekt f äl-
len. Der Coach ist genau das Gegenteil. Man bemisst einen Coach daran, ob er
wenige technische Entscheidungen trifft: Aufgabe des Coachs ist es, alle anderen
dazu zu bringen, die richtigen Entscheidungen zu treffen.
Der Coach übernimmt nicht für viele Entwicklungsaufgaben die Verantwortung.
Sein Aufgabenbereich lässt sich dagegen wie folgt beschreiben:
 Er muss als Entwicklungspartner verf ügbar sein, insbesondere f ür neue Pro-
grammierer, die erste Verantwortung übernehmen, oder f ür besonders
schwierige technische Aufgaben.
 Er muss langfristige Refactoring-Ziele erkennen und Refactoring in kleinem
Umfang fördern, um diese Ziele teilweise zu erreichen.
--- PAGE 94 ---
74 12 Managementstrategie
 Er muss Programmierern mit einzelnen technischen Kenntnissen helfen, wie
Testen, Formatieren und Refactoring.
 Er muss den Prozess dem Management erklären.
Aber die wichtigste Aufgabe des Coachs besteht wahrscheinlich in der Besorgung
von Spielsachen und Essen. XP-Projekte ziehen anscheinend Spielsachen an.
Meistens wird es sich dabei um die Dinge handeln, die von querdenkenden Bera-
tern allerorts empfohlen werden. Gelegentlich erhält der Coach jedoch die Gele-
genheit, durch den Kauf des richtigen Spielzeugs die Entwicklung nachhaltig zu
beeinflussen, und eine der gr ößten Aufgaben des Coachs besteht darin, diese
Möglichkeit zu erkennen und zu nutzen. In dem Chrysler-C3-Projekt blieben die
Designsitzungen beispielsweise immer stundenlang ohne konkretes Ergebnis.
Daher kaufte ich eine gew öhnliche Küchenuhr und ordnete an, dass kein Mee-
ting länger als zehn Minuten dauern d ürfte. Ich glaube nicht, dass die K üchen-
uhr jemals wirklich zum Einsatz kam, aber ihre pure Pr äsenz erinnerte jeden
daran, darauf zu achten, wann eine Diskussion unfruchtbar geworden war und
nur dazu diente, möglichst den Moment herauszuzögern, an dem man aufstehen
und programmieren musste, um eine gesicherte Antwort zu erhalten.
Essen ist ein weiteres Kennzeichen von XP-Projekten. Brot mit jemandem zu bre-
chen hat eine besondere Wirkung. Man f ührt eine v öllig andere Diskussion,
wenn man gleichzeitig kaut. Daher liegt in XP-Projekten immer etwas zum Essen
herum. (Ich empfehle besonders Frigor Noir Schokoriegel, wenn Sie sie irgendwo
auftreiben können, obwohl einige Projekte anscheinend mit Lakritz überdauern
können. Sie können gerne Ihre eigene Speisekarte entwerfen.)
Rob Mee schreibt:
Sie wissen, diese Testreihen sind recht heimt ückisch. In meinem Team haben wir uns
mit Essen und Getränken belohnt. Um 14:35 hieß es: »Wenn wir um 15 Uhr wieder bei
100% sind, dann können wir Tee trinken und eine Kleinigkeit essen.« Natürlich werden
wir auf jeden Fall eine Kleinigkeit essen, auch wenn es bis 15:15 dauert. Wir essen aber
fast nie, bevor die Tests fehlerfrei laufen – wenn  wir das erreicht haben, wird aus der
Pause ein kleines Fest. (Quelle: E-Mail)
Terminmanagement
Das Terminmanagement (engl. tracking) ist eine weitere wichtige Management-
komponente in XP. Sie k önnen die sch önsten Aufwandssch ätzungen machen,
aber wenn Sie den konkreten Projektverlauf nicht mit Ihren Schätzungen verglei-
chen, dann lernen Sie nie dazu.
--- PAGE 95 ---
 Intervention 75
Aufgabe des Terminmanagers ist es, die Messdaten, die gerade erfasst werden, zu
sammeln und dafür zu sorgen, dass das Team wei ß, wie die tats ächlichen Mess-
ergebnisse aussehen (und daran erinnert wird, was gewünscht wurde).
Das Planungsspiel zu leiten gehört zum Managen von Terminen. Der Terminma-
nager (engl. tracker) muss die Spielregeln genau kennen und ihre Einhaltung
auch in emotional geladenen Situationen erzwingen (Spielen ist immer emotio-
nal).
Das Managen der Termine muss ohne gro ßen zusätzlichen Aufwand nebenher
laufen. Wenn die Person, die die tats ächliche Entwicklungszeit erfasst, die Pro-
grammierer zweimal täglich nach ihrem Status fragt, dann werden die Program-
mierer sicher bald fl üchten, statt diese Unterbrechung in Kauf zu nehmen. Der
Terminmanager sollte dagegen ausprobieren, mit welcher minimalen Menge von
Messdaten das Projekt noch effizient laufen kann. Zweimal w öchentlich Daten
über die tatsächliche Entwicklungszeit zu sammeln ist völlig ausreichend.
Intervention
Zum Management eines XP-Teams gehört mehr, als Knabberzeug zu kaufen und
Fußball zu spielen. Gelegentlich lassen sich Probleme einfach nicht durch die
unglaubliche Brillanz des Teams lösen, das durch einen liebenden und aufmerk-
samen Manager ermutigt wird. Bei solchen Gelegenheiten muss der Manager in
der Lage sein, einzugreifen, Entscheidungen zu f ällen – auch wenig popul äre –
und die Konsequenzen zu tragen.
Zuerst muss der Manager jedoch sorgf ältig prüfen, ob es etwas gibt, was zuvor
übersehen wurde oder hätte getan werden können, um das Problem von vornhe-
rein zu vermeiden. Der Zeitpunkt für Interventionen ist nicht dazu geeignet, eine
weiße Rüstung anzulegen und auf ein Pferd zu springen. Stattdessen ist es eher
angebracht, auf das Team zuzugehen und zu sagen: »Ich weiß nicht, wie ich es so
weit habe kommen lassen k önnen, aber nun muss ich XXX tun. « An Tagen, an
denen Interventionen erforderlich sind, ist Demut angesagt.
Zu den Dingen, die eine Intervention erfordern k önnen, geh ört ein Personal-
wechsel. Wenn man mit einem Teammitglied nicht zufrieden ist, muss der
Manager diesem Mitglied kündigen. Und Entscheidungen dieser Art werden bes-
ser zu fr üh als zu sp ät getroffen. Wenn Sie sich kein Szenario mehr vorstellen
können, in dem der Betreffende mehr n ützt als behindert, ist es an der Zeit, zu
handeln. Abzuwarten wird das Problem nur noch verschlimmern.
--- PAGE 96 ---
76 12 Managementstrategie
Eine etwas angenehmere Pflicht sind Interventionen, wenn der Teamprozess
geändert werden muss. Es ist im Allgemeinen nicht die Aufgabe des Managers,
vorzuschreiben, was und wie etwas ge ändert werden muss, sondern seine Auf-
gabe besteht darin, die Notwendigkeit einer Änderung aufzuzeigen. Das Team
sollte dann eines oder mehrere Experimente vorschlagen, die man durchf ühren
könnte. Der Manager gibt dann wiederum R ückmeldung über die durch die
Experimente bedingten Änderungen.
Schließlich gehört es zu den Pflichten eines Managers, ein Projekt zu beenden.
Das Team würde von sich aus wahrscheinlich niemals aufh ören. Es wird jedoch
der Tag kommen, an dem jede weitere Entwicklungsinvestition in das aktuelle
System weniger lohnend ist als eine andere Alternative, wie z.B. ein neues Projekt
zu beginnen. Der Manager muss erkennen k önnen, wann diese Schwelle über-
schritten wird, und das obere Management über die Notwendigkeit einer Verän-
derung informieren.
--- PAGE 97 ---
13 Strategie hinsichtlich der 
Arbeitsumgebung
Wir richten eine offene Arbeitsumgebung für unser Team ein, die kleine private Arbeits-
bereiche am Rand und einen gemeinsamen Programmierbereich in der Mitte aufweist.
Ron Jeffries schreibt zu Abbildung 13.1:
Das Bild zeigt den Arbeitsbereich des DaimlerChrysler-C3-Gehaltsabrechnungsteams.
Auf zwei großen Tischen stehen sechs Entwicklungsrechner. Programmierer sitzen paar-
weise an den für ihre Arbeit verfügbaren Rechnern und programmieren. (Dieses Bild ist
nicht gestellt: sie arbeiten wirklich wie hier gezeigt zusammen. Der Fotograf arbeitet mit
Chet, der am hinteren Tisch mit dem Rücken zur Kamera sitzt.)
Die beiden sichtbaren Wände sind mit weißen Tafeln verkleidet, die Funktionstests,
welche besonderer Aufmerksamkeit bedürfen, geplante CRC-Sitzungen und auf der hin-
teren Tafel den Iterationsplan zeigen. Die Zettel über der linken Tafel enthalten kleine
Schilder, auf denen die XP-Regeln des Teams zu sehen sind.
An den Wänden rechts von und vor der Kamera sind kleine Arbeitstische angebracht,
die gerade groß genug für ein Telefon und eine Schreibfläche sind.
Im hinteren Bereich des Raums zwischen dem Computertisch und der weißen Tafel
steht ein normaler Tisch, an dem sich das Team zu CRC-Sitzungen zusammensetzt. Der
Tisch ist üblicherweise mit CRC-Karten und Essen bedeckt, da eine der Teamregeln
besagt: »Es muss etwas zum Essen da sein.«
Der Raum wurde vom Team gestaltet: Wir haben uns tatsächlich dazu entschieden,
hier zu sein. Die Leute sprechen leise und der Lärmpegel ist überraschend niedrig. Aber
wenn man Hilfe braucht, muss man seine Stimme nur ein klein wenig heben und
bekommt sie. Man bekommt sofort Hilfe: Beachten Sie, dass der Fußboden nicht mit
Teppich ausgelegt ist, was bedeutet, dass wir mit unseren Stühlen wirklich schnell hin
und her rollenkönnen!
Wenn Sie keinen vernünftigen Arbeitsplatz haben, dann wird Ihr Projekt nicht
funktionieren. Der Unterschied zwischen einem guten Arbeitsbereich und einem
schlechten Arbeitsbereich macht sich unmittelbar und drastisch in der Team-
arbeit bemerkbar.
Ein Wendepunkt in meiner Laufbahn als Berater war, als man mich bat, das
objektorientierte Design eines Projekts zu begutachten. Ich sah mir das System
an und konnte bestätigen, dass es chaotisch war. Dann fiel mir auf, wo die einzel-
nen Programmierer saßen. Das Team bestand aus vier erfahrenen Programmie-
--- PAGE 98 ---
78 13 Strategie hinsichtlich der Arbeitsumgebung
rern. Jeder von ihnen hatte ein Eckb üro an den vier Ecken eines mittelgro ßen
Gebäudes. Ich sagte Ihnen, sie sollten ihre B üros zusammenlegen. Ich wurde
wegen meiner Kenntnisse von Smalltalk und Objekten in die Firma geholt und
der wertvollste Rat, mit dem ich aufwarten konnte, bestand in dem Vorschlag,
die Büromöbel anders anzuordnen.
Die Ausstattung eines B üros ist in jedem Fall eine schwierige Aufgabe. Es gibt
eine Menge miteinander in Konflikt stehender Anspr üche. B üroplaner werden
danach beurteilt, wie viel Geld sie ausgeben und wie viel Flexibilit ät sie ermögli-
chen. Die Leute, die die B üroausstattung nutzen, m üssen eng mit den anderen
Teammitgliedern zusammenarbeiten. Gleichzeitig brauchen sie aber auch eine
Privatsphäre, um z.B. einen Arzttermin zu vereinbaren.
XP möchte lieber zu viel als zu wenig öffentliche Räume zur Verf ügung stellen.
XP ist eine gemeinschaftliche Methode der Softwareentwicklung. Die Teammit-
glieder müssen in der Lage sein, sich zu sehen, in den Raum gestellte Fragen zu
hören und »zufällig« Unterhaltungen mitzubekommen, zu denen sie Wichtiges
beitragen können.
XP kann eine Herausforderung f ür Büroplaner sein. Die üblichen Büroaufteilun-
gen eignen sich nicht für XP. Man kann seinen Computer z.B. nicht in eine Ecke
stellen, da dann unmöglich zwei Personen nebeneinander an dem Computer sit-
Abbildung 13.1  Der Arbeitsbereich des DaimlerChrysler-C3-Teams

--- PAGE 99 ---
13 Strategie hinsichtlich der Arbeitsumgebung 79
zen und programmieren können. Die Höhe der normalen Trennwände für Groß-
raumbüros ist ungeeignet. Die Trennwände zwischen Arbeitsplätzen sollten halb-
hoch sein oder ganz entfernt werden. Gleichzeitig sollte das Team von anderen
Teams getrennt sein.
Die beste Anordnung besteht in einem offenen, langen und schmalen Raum, um
dessen offenen Innenraum herum kleine Arbeitsnischen angebracht sind. Die
Teammitglieder können ihre persönlichen Dinge in diesen Arbeitsnischen depo-
nieren, von dort aus Telefongespräche führen oder sich dort aufhalten, wenn sie
nicht gestört werden m öchten. Die anderen Teammitglieder m üssen die »virtu-
elle« Privatsphäre derjenigen, die in diesen Arbeitsnischen sitzen, respektieren.
Die größten und schnellsten Entwicklungsrechner sollten sich auf Tischen in der
Mitte des Raums befinden (auch in den Arbeitsnischen k önnen sich Rechner
befinden, m üssen aber nicht). Dadurch wird jemand, der programmieren
möchte, praktisch gezwungen, sich in den offenen, allen zug änglichen Raum zu
begeben. Von dort aus kann jeder ohne Weiteres beobachten, was vor sich geht.
Man kann mühelos Paare bilden, und jedes Paar kann von der Energie der ande-
ren Programmiererpaare, die zur gleichen Zeit entwickeln, profitieren.
So weit möglich, sollte man den sch önsten Teil in dem Raum auf einer Seite f ür
einen Gemeinschaftsraum reservieren. Statten Sie diesen Gemeinschaftsraum mit
einer Espressomaschine, Sofas, etwas Spielzeug und anderen Dingen aus, die die
Teammitglieder anlocken. Wenn man sich festgefahren hat, ist es h äufig hilf-
reich, einen Moment lang vom Arbeitsplatz wegzugehen, um wieder neue Ideen
zu sammeln. Wenn es einen angenehmen Platz gibt, den man aufsuchen kann,
dann ist es wahrscheinlicher, dass man dies bei Bedarf auch tut.
Der Wert Mut findet seinen Ausdruck in der XP-Haltung gegenüber der Büroaus-
stattung. Wenn die Firma in Bezug auf die B üroausstattung eine Haltung ein-
nimmt, die mit der des Teams in Konflikt steht, dann gewinnt das Team. Befin-
den sich die Computer an der falschen Stelle, dann stellt man sie um. Wenn
Trennwände im Weg sind, dann entfernt man sie. Ist die Raumbeleuchtung zu
hell, dann wechselt man sie aus. Sind die Telefone zu laut, dann werden sie eines
Tages nur noch gedämpft klingeln.
Ich sollte einmal in einer Bank arbeiten und stellte an meinem ersten Arbeitstag
fest, dass man uns hässliche alte kleine Schreibtische zugeteilt hatte. Die Schreib-
tische hatten links und rechts Metallschubladen, sodass in der Mitte quasi nur
ein Schlitz für die Beine blieb. Wir suchten uns einen geeigneten Schraubenzie-
her und montierten dann die Schubladen auf einer Seite des Schreibtisches ab.
Dadurch konnten zwei Leute nebeneinander an einem Schreibtisch sitzen.
--- PAGE 100 ---
80 13 Strategie hinsichtlich der Arbeitsumgebung
Dieses Herumbasteln an M öbeln kann einen in Schwierigkeiten bringen. Die
Leute, die die B üroausstattung verwalten, k önnen wirklich ärgerlich werden,
wenn sie herausfinden, dass jemand ohne ihre Genehmigung oder Beteiligung
die Möbel umgestellt hat (auch wenn eine offiziell angeforderte Änderung erst
nach Wochen oder Monaten ausgef ührt wird). Ich sage dann, tut mir Leid, ich
muss Software programmieren und wenn das Entfernen einer Trennwand dazu
beiträgt, dass ich die Software besser programmieren kann, dann entferne ich sie.
Falls das Unternehmen so viel Initiative nicht ertragen kann, dann m öchte ich
sowieso nicht dort arbeiten.
Die Büroausstattung ist ein andauerndes Experimentieren wert (der Wert Feed-
back in Aktion). Schließlich hat das Unternehmen eine Unmenge für all diese fle-
xiblen Büromöbel bezahlt. Dieses Geld wäre verschwendet, würde man die Flexi-
bilität der M öbel nicht nutzen. Was passiert, wenn man die Arbeitsbereiche
zweier Leute näher zusammen rückt? Oder weiter auseinander rückt? Wie würde
es sich machen, wenn der Integrationsrechner in der Mitte des Raumes st ünde?
Oder in der Ecke? Probieren Sie es aus. Was funktioniert, bleibt. Was nicht funk-
tioniert, fällt dem nächsten Experiment zum Opfer.
--- PAGE 101 ---
14 Geschäftliche und technische 
Verantwortung trennen
Ein Schlüsselmoment unserer Strategie besteht darin, dass sich Techniker auf technische
Probleme und Geschäftsleute auf geschäftliche Probleme konzentrieren sollen. Das
Projekt muss durch geschäftliche Entscheidungen gesteuert werden; bei geschäftlichen
Entscheidungen müssen jedoch technische Entscheidungen hinsichtlich der Kosten und
Risiken berücksichtigt werden.
Es gibt einen verbreiteten Fehler in der Beziehung zwischen Geschäft und Ent-
wicklung. Wenn eine der beiden Seiten zu viel Macht erhält, leidet das Projekt
darunter.
Geschäftsseite
Wenn die Geschäftsseite an der Macht ist, dann fühlt sie sich dazu berufen, der
Entwicklung alle vier Variablen zu diktieren. »Sie werden genau dies tun. Sie wer-
den dann damit fertig sein. Nein, es können keine neuen Workstations ange-
schafft werden. Und Sie liefern am besten Topqualität oder Sie sind in Schwierig-
keiten, mein Lieber.«
In diesem Szenario fordert die Geschäftsseite zu viel. Einige Punkte auf der Liste
von Anforderungen mögen absolut unabdingbar sein. Andere dagegen sind es
nicht. Wenn die Entwickler völlig machtlos sind, dann können sie nicht wider-
sprechen. Sie können dann die Geschäftsseite nicht zwingen, Prioritäten zu set-
zen. Die Entwickler machen sich also pflichtbewusst und mit hängenden Köpfen
an die Arbeit an einer unmöglichen Aufgabe, die ihnen vorgeschrieben wurde.
Es scheint in der Natur der weniger wichtigen Anforderungen zu liegen, dass sie
das höchste Risiko bergen. Diese Anforderungen sind typischerweise am wenigs-
ten klar und daher ist das Risiko groß, dass sich diese Anforderungen im Laufe
der Entwicklung ändern. Irgendwie scheinen sie auch in technischer Hinsicht ris-
kanter zu sein.
Ergebnis des Szenarios »Geschäftsseite an der Macht« ist dann, dass das Projekt
für einen zu geringen Gewinn zu viel Aufwand treibt und viel zu viele Risiken
eingeht.
--- PAGE 102 ---
82 14 Gesch äftliche und technische Verantwortung trennen
Entwicklungsseite
Wenn nun umgekehrt die Entwicklungsseite an die Macht kommt, dann möchte
man vielleicht glauben, dass sich die Dinge zum Besseren wenden. Dem ist aber
nicht so. Im Grunde genommen hat dies den gleichen Effekt.
Wenn die Entwickler das Sagen haben, dann implementieren sie all die Prozesse
und Technologien, für die sie keine Zeit hatten, als sie von »den Herren in den
Anzügen« herumkommandiert wurden. Sie installieren neue Tools, neue Spra-
chen, neue Technologien. Und die Tools, Sprachen und Technologien werden
ausgewählt, weil sie interessant und neu sind. Neuigkeit impliziert Risiken.
(Wenn wir das bislang nicht gelernt haben, wann werden wir es dann lernen?)
Im Endeffekt hat auch das Szenario »Entwicklung an der Macht « das Ergebnis,
dass das Projekt für einen zu geringen Gewinn zu viel Aufwand betreibt und viel
zu viele Risiken eingeht.
Was tun?
Die Lösung besteht darin, die Verantwortung und die Macht zwischen Geschäfts-
seite und Entwicklungsseite aufzuteilen. Die Gesch äftsleute sollten diejenigen
Entscheidungen treffen, f ür die sie kompetent sind. Die Programmierer sollten
die Entscheidungen treffen, für die sie kompetent sind. Jede Partei sollte über die
Entscheidungen der anderen Partei informiert werden und diese berücksichtigen.
Keine der Parteien sollte in der Lage sein, einseitig Entscheidungen zu treffen.
Diesen politischen Balanceakt aufrechtzuerhalten mag so gut wie unm öglich
erscheinen. Wenn die UN dazu nicht in der Lage ist, wie sollten wir das können?
Wenn man nur das vage Ziel hat, »politische Macht im Gleichgewicht zu hal-
ten«, dann hat man sicher keine Chance. Die erste machtbewusste Person, die
daherkäme, würde die Balance aus dem Gleichgewicht bringen. Glücklicherweise
kann das Ziel aber sehr viel konkreter sein.
Zuerst eine Geschichte. Wenn mich jemand fragt, ob ich einen Ferrari oder einen
Minivan möchte, dann entscheide ich mich mit ziemlicher Sicherheit f ür den
Ferrari, da dieses Auto eindeutig mehr Spa ß m a c h t .  S o b a l d  a b e r  j e m a n d  s a g t :
»Möchten Sie den Ferrari f ür 200.000 Francs oder den Minivan f ür 40.000
Francs?« kann ich eine triftige Entscheidung fällen. Wenn man weitere Anforde-
rungen hinzufügt wie »Ich muss damit fünf Kinder transportieren können« oder
»Der Wagen muss 200 Kilometer in der Stunde fahren k önnen«, dann wird das
Bild noch klarer. Es gibt Fälle, in denen beide Entscheidungen sinnvoll sein kön-
nen, aber man kann auf der Grundlage von Werbebildchen keine fundierte Ent-
--- PAGE 103 ---
 Wahl der Technologie 83
scheidung treffen. Man muss wissen, welche Ressourcen einem zur Verf ügung
stehen, welche Zwänge gegeben sind und welche Kosten mit jeder Entscheidung
verbunden sind.
Diesem Modell folgend, sollten Geschäftsleute bestimmen über
 den Umfang und den Zeitplan von Versionen
 die relative Priorität von vorgeschlagenen Leistungsmerkmalen
 den genauen Umfang von vorgeschlagenen Leistungsmerkmalen
Zu diesen Entscheidungen muss die Entwicklungsabteilung Folgendes beitragen:
 Einschätzung des für die Implementierung der verschiedenen Leistungsmerk-
male erforderlichen Zeitaufwands
 Einschätzung der Konsequenzen verschiedener technischer Alternativen
 Ein Entwicklungsprozess, der sich mit den Pers önlichkeiten der Mitarbeiter,
der Gesch äftsumgebung und der Unternehmenskultur vertr ägt. Kein Regel-
werk darüber, wie man Software schreibt, kann jeder Situation angemessen
sein. In der Tat kann keine einzige Liste in irgendeiner Situation passend sein,
da sich die Situation ständig ändert.
 Die Entscheidung, welche Verfahren man am Anfang der Entwicklung ein-
setzt und wie man die Auswirkungen dieser Verfahren bewertet und mit
Änderungen experimentiert. Dies ist mit der amerikanischen Verfassung ver-
gleichbar, die eine Grundphilosophie, eine Reihe von Grundregeln (die Men-
schenrechte, die ersten zehn Zusatzartikel) und Regeln zum Ändern der
Regeln (durch das Hinzufügen neuer Verfassungsänderungen) festlegt.
Da über die gesamte Lebensdauer eines Projekts Geschäftsentscheidungen gefällt
werden müssen, impliziert die Übertragung der Verantwortung für Geschäftsent-
scheidungen an die Gesch äftsleute, dass der Kunde genauso zum Team geh ören
muss wie der Programmierer. Die besten Ergebnisse erzielt man, wenn die
Geschäftsseite mit den übrigen Teammitgliedern in einem Raum sitzt und st än-
dig zur Beantwortung von Fragen verfügbar ist.
Wahl der Technologie
Während die Wahl der Technologie auf den ersten Blick eine rein technische
Angelegenheit zu sein scheint, ist es tats ächlich eine Geschäftsentscheidung, bei
der allerdings die Meinung der Entwicklungsseite ber ücksichtigt werden muss.
Der Kunde muss mit einer Datenbank oder mit einer Sprache viele Jahre lang
leben und muss ebenso auf der Geschäfts- wie auf der technischen Ebene mit die-
ser Beziehung zufrieden sein. 
--- PAGE 104 ---
84 14 Gesch äftliche und technische Verantwortung trennen
Wenn mir ein Kunde sagt: »Wir möchten dieses System und Sie müssen mit die-
ser relationalen Datenbank und mit dieser Java-Entwicklungsumgebung arbei-
ten«, dann besteht meine Aufgabe darin, ihm die Konsequenzen dieser Entschei-
dung vor Augen zu halten. Wenn ich der Meinung bin, eine Objektdatenbank
und C++ sind passender, dann nehme ich für beide Alternativen eine Aufwands-
schätzung vor. Dann können die Geschäftsleute eine Geschäftsentscheidung tref-
fen.
Technische Entscheidungen haben allerdings noch eine Seite, die eindeutig in
den Bereich der Entwicklung geh ört. Nachdem eine Technologie in einer Firma
eingeführt wurde, muss sie jemand pflegen, solange sie verwendet wird. Die Kos-
ten der neuesten und besten Technologien liegen nicht einfach in der anf ängli-
chen Entwicklung bis zur Produktionsreife oder überhaupt in der Entwicklung.
Die Kosten beinhalten auch die Kosten für die Herausbildung und Aufrechterhal-
tung der Kompetenz, die zur Pflege dieser Technologie erforderlich ist.
Was passiert, wenn es schwierig wird?
Meist sind die Entscheidungen, die aus diesem Prozess hervorgehen, überra-
schend einfach auszuführen. Programmierer haben ein Talent dafür, hinter allem
Monster lauern zu sehen. Die Gesch äftsleute sagen: »Ich hatte keine Ahnung,
dass das so teuer ist. Implementieren Sie einfach dieses Drittel hier. Das reicht
fürs Erste.«
Manchmal lassen sich die Dinge aber nicht so einfach l ösen. Manchmal ist der
kleinste, wertvollste Teil der Entwicklung aus der Perspektive der Programmierer
umfangreich und riskant. Wenn das passiert, dürfen Sie die Augen nicht vor die-
ser Tatsache verschließen. Sie müssen dann sehr vorsichtig sein. Sie können sich
nicht viele Fehler leisten. Sie m üssen unter Umst änden externe Ressourcen ins
Team holen. In dem Moment aber, an dem Sie den Sch ützengraben verlassen
können, haben Sie Ihr Geld verdient. Sie tun alles, um eine Verkleinerung des
Umfangs zu bewirken. Sie tun alles, um das Risiko zu minimieren. Aber dann
wagen Sie den Sprung.
Anders gesagt, die Teilung der Macht zwischen Gesch äftsseite und Entwicklung
soll nicht als Entschuldigung daf ür dienen, schwierige Aufgaben zu vermeiden.
Ganz im Gegenteil. Dadurch erhält manvielmehr die Möglichkeit, die Aufgaben,
die an sich schwierig sind, von denen zu trennen, bei denen Sie noch nicht
dahintergekommen sind, wie man sie einfacher gestalten kann. Meist ist die
Arbeit einfacher, als Sie es sich anfangs vorgestellt haben. Ist dies nicht der Fall,
dann tun Sie sie trotzdem, weil Sie genau dafür bezahlt werden.
--- PAGE 105 ---
15 Planungsstrategie
Wir planen, indem wir rasch einen groben Plan entwerfen, den wir ständig weiter ver-
bessern, wobei wir immer kürzere Zeiträume – Jahre, Monate, Wochen, Tage – betrach-
ten. Wir erstellen den Plan schnell und kostengünstig, sodass das Trägheitsmoment im
Fall notwendiger Änderungen gering ausfällt.
Bei der Planung geht es darum, zu überlegen, wie es sein wird, eine Softwarekom-
ponente zusammen mit einem Kunden zu entwickeln. Die Planung dient unter
anderem den Zwecken
 ein Team zusammenzuführen
 über Umfang und Prioritäten zu entscheiden
 das Vertrauen aller Beteiligten zu stärken, dass das System tatsächlich imple-
mentiert werden kann
 einen Fixpunkt für ein regelmäßiges Feedback zur Verfügung zu stellen
Sehen wir uns noch einmal die Prinzipien an, die auf die Planung Einfluss haben.
(Einige davon sind allgemeine Prinzipien aus Kapitel 8, »Grundprinzipien«.
Andere betreffen nur die Planung.)
 Planen Sie nur so viel, wie für die nächste Zeithorizontlinie erforderlich ist –
Planen Sie auf jeder Detailebene nur bis zum nächsten Horizontlinie – d.h.
die nächste Version, das Ende der nächsten Iteration. Das heißt nicht, dass Sie
nicht langfristig planen dürfen. Sie dürfen, nur nicht bis ins kleinste Detail.
Sie können diese Version detailliert planen oder auf die nächsten fünf (vorge-
schlagenen) Versionen mit einer Reihe von Aufzählungspunkten eingehen.
Solch eine Skizze ist dem Versuch, alle sechs Versionen detailliert zu planen,
kaum unterlegen.
 Verantwortung übernehmen – Verantwortung kann übernommen, aber nicht
zugewiesen werden. Das heißt, dass es in XP keine von oben verordnete Pla-
nung (die so genannte Top-down-Planung) gibt. Der Manager kann nicht
zum Team gehen und sagen: »Hier ist das, was wir zu erledigen haben, und
das wird die und die Zeit dauern.« Der Projektmanager muss das Team bitten,
die Verantwortung für die zu erledigenden Aufgaben zu übernehmen. Und
dann muss er sich die Reaktionen anhören.
 Die Person, die für die Implementierung verantwortlich ist, schätzt den Auf-
wand ein – Wenn das Team die Verantwortung dafür übernimmt, etwas zu
erledigen, dann kann das Team auch sagen, wie lange dies dauern wird.
Wenn ein Einzelner im Team eine bestimmte Aufgabe übernimmt, dann
kann er sagen, wie lange es dauern wird.
--- PAGE 106 ---
86 15 Planungsstrategie
 Abhängigkeiten zwischen Teilen ignorieren – Planen Sie so, als k önnten die
zu entwickelnden Teile beliebig miteinander vertauscht werden. Solange Sie
sorgsam darauf achten, die Dinge mit der h öchsten Geschäftspriorität zuerst
zu implementieren, sorgt diese einfache Regel dafür, dass Sie nicht in Schwie-
rigkeiten geraten. »Wie viel kostet der Kaffee?« »Der Kaffee kostet 50 Pfennig,
aber das Nachschenken ist kostenlos.« »Dann möchte ich bitte nur das Nach-
schenken.« So etwas passiert dann nicht so leicht.
 Nach Prioritäten planen statt nach Entwicklungsgesichtspunkten – Beachten
Sie, welchen Zweck eine Planung erf üllen soll. Wenn Sie planen, damit der
Kunde Prioritäten setzen kann, dann kann eine sinnvolle Planung mit sehr
viel weniger Details auskommen, als wenn Sie die Implementierung planen,
bei der bestimmte Testfälle erforderlich sind.
Das Planungsspiel
Die XP-Planung abstrahiert im Planungsprozess absichtlich zwei Teilnehmer – die
Geschäftsseite und die Entwicklung. Dies kann dazu beitragen, etwas von der we-
nig hilfreichen emotionalen Hitze aus der Diskussion von Pl änen zu nehmen.
Statt »Hans, Sie Idiot, Sie haben mir dies für Freitag versprochen«, sagt man im Pla-
nungsspiel: »Die Entwicklung hat etwas gelernt. Sie braucht von der Gesch äfts-
seite Unterstützung darin, auf die optimale Art und Weise zu reagieren.« Es ist un-
möglich, dass sich Gef ühle durch ein einfaches Regelwerk beseitigen lassen und
dies ist auch nicht beabsichtigt. Die Regeln sind dafür da, jeden daran zu erinnern,
wie man sich gern verhalten w ürde, und sie dienen als gemeinsame Referenz,
wenn etwas schief läuft.
Die Geschäftsseite kann die Entwicklung oft nicht besonders leiden. Die Bezie-
hungen zwischen den Leuten, die das System brauchen, und den Leuten, die das
System entwickeln, sind so angespannt, dass sie oft den Beziehungen zwischen
Jahrhunderte alten Feinden gleichen. Misstrauen, Beschuldigungen und subtiles,
indirektes Lavieren sind verbreitet. Man kann in einer solchen Umgebung keine
solide Software entwickeln.
Wenn Ihre Umgebung nicht dieser Beschreibung entspricht, dann ist das gut f ür
Sie. Die beste Umgebung ist eine Umgebung gegenseitigen Vertrauens. Die Par-
teien respektieren einander. Jede Partei glaubt, dass der anderen Partei ihr eigenes
Interesse und das Interesse der Mehrheit am Herzen liegt. Jede Partei ist bereit,
die andere Partei ihre Arbeit tun zu lassen und die Fähigkeiten, Erfahrungen und
Perspektiven beider Parteien zu vereinen.
--- PAGE 107 ---
 Das Planungsspiel 87
Man kann diese Art von Beziehungen nicht durch Gesetze verordnen. Man kann
nicht einfach sagen: »Wir wissen, wir haben Mist gebaut. Es tut uns schrecklich
leid. Es wird nicht wieder vorkommen. Lasst uns v öllig anders arbeiten und
gleich nach dem Mittagessen damit beginnen. « Die Welt und die Menschen
funktionieren einfach nicht so. Unter Stress neigen die Leute dazu, wieder in ihre
alten Verhaltensweisen zu verfallen, gleichgültig, welche schlechten Erfahrungen
ihnen dieses Verhalten in der Vergangenheit beschert hat.
Was zu einer Beziehung des gegenseitigen Respekts erforderlich ist, ist eine Reihe
von Regeln, die festlegen, wie man sich in der Beziehung verh ält – wer welche
Entscheidungen treffen darf, wann die Entscheidungen getroffen werden, wie
diese Entscheidungen aufgezeichnet werden.
Vergessen Sie jedoch nie, dass die Spielregeln ein Hilfsmittel sind, ein Schritt in
Richtung auf die Beziehung hin, die sie eigentlich zu Ihren Kunden haben möch-
ten. In den Regeln k önnen niemals die Subtilit ät, Flexibilität und Leidenschaft
echter menschlicher Beziehungen zum Ausdruck kommen. Ohne Regeln kann
man jedoch nicht beginnen, die Situation zu verbessern. Sobald man aber einmal
Regeln hat und die Situation sich langsam verbessert, dann kann man damit
beginnen, die Regeln abzu ändern, um die Entwicklungsarbeit zu erleichtern.
Wenn die Regeln erst einmal zur Gewohnheit geworden sind, kann man sie ganz
aufgeben.
Zuerst m üssen Sie aber lernen, nach den Regeln zu spielen. Und das sind die
Regeln:
Das Ziel
Ziel des Spiels ist es, den Wert der vom Team produzierten Software zu maximie-
ren. Vom Wert der Software muss man die Entwicklungskosten und das Risiko,
das während der Entwicklung eingegangen wird, abziehen.
Die Strategie
Die Strategie des Teams besteht darin, unter Ma ßgabe der Programmier- und
Designstrategien so wenig wie m öglich zur Minimierung des Risikos zu investie-
ren, um die wertvollste Funktionalität so schnell wie möglich in Betrieb zu neh-
men. Im Licht der technologischen und gesch äftlichen Erkenntnisse dieses ers-
ten Systems wird der Gesch äftsseite klar, was nun die wertvollste Funktionalit ät
ist, und das Team kann diese Funktionalit ät rasch zur Produktionsreife entwi-
ckeln. Und so weiter.
--- PAGE 108 ---
88 15 Planungsstrategie
Die Spielelemente
Gespielt wird im Planungsspiel mit Karten, die als »Storycards« bezeichnet wer-
den. Abbildung 15.1 zeigt ein Beispiel für eine solche Karte.
Die Spieler
Das Planungsspiel wird von zwei Spielern gespielt, nämlich von der Entwicklung
und der Gesch äftsseite. Die Entwicklung setzt sich aus all den Personen zusam-
men, die f ür die Implementierung des Systems verantwortlich sind. Die
Geschäftsseite besteht aus den Leuten, die die Entscheidungen dar über treffen,
was das System leisten soll.
Manchmal l ässt sich sofort erkennen, wer die Rolle der Gesch äftsseite im Pla-
nungsspiel spielt. Wenn ein Investmentbroker f ür eine ma ßgeschneiderte Soft-
warekomponente zahlt, dann nimmt er die Rolle der Gesch äftsseite ein. Er kann
entscheiden, was am wichtigsten ist und zuerst erledigt werden muss. Wie sieht
es aber aus, wenn Sie ein kommerzielles Softwareprodukt f ür den Massenmarkt
entwickeln? Wer repräsentiert dann die Gesch äftsseite? Die Geschäftsseite muss
Entscheidungen über den Umfang, die Prioritäten und den Inhalt von Versionen
entscheiden. Dies sind Entscheidungen, die in der Regel von der Marketingabtei-
lung getroffen werden. Wenn diese Abteilung klug ist, dann st ützt sie ihre Ent-
scheidungen durch
Abbildung 15.1  Eine Storycard

--- PAGE 109 ---
 Das Planungsspiel 89
 echte Benutzer des Produkts
 Zielgruppen
 Vertriebsmitarbeiter
Einige der besten Spieler der Gesch äftsseite, die ich kennen gelernt habe, waren
professionelle Anwender. Beispielsweise habe ich an einem Kundendienstsystem
für einen Investmentfond gearbeitet. Die Rolle der Gesch äftsseite wurde vorwie-
gend von der Leiterin der Kundendienstabteilung eingenommen, die sich in der
Firma hochgearbeitet hatte, das vorherige System über Jahre hinweg verwendet
hatte und es in- und auswendig kannte. Von Zeit zu Zeit hatte sie Schwierigkei-
ten, das, was das neue System leisten sollte, von dem zu unterscheiden, was das
alte System leistete, aber nachdem sie eine Weile mit Storycards gearbeitet hatte,
lernte sie es.
Die Spielzüge
Das Spiel umfasst drei Phasen:
 Erforschung – Herausfinden, was das alte System geleistet hat.
 Verpflichtung – Entscheiden, welche Teilmenge der m öglichen Anforderun-
gen als Nächstes in Angriff genommen wird.
 Steuerung – Die Entwicklung steuern, während die Realität den Plan formt.
Die Spielzüge einer Phase werden in der Regel in der betreffenden Phase ausge-
führt, aber nicht ausschließlich. Beispielsweise beschreibt man in der Steuerungs-
phase auch neue Leistungsmerkmale (Storycards). Die Phasen sind zudem
zyklisch. Nachdem man eine Zeit lang die Entwicklung gesteuert hat, muss man
wieder forschen.
Erforschungsphase
Zweck der Erforschungsphase ist es, beiden Spielern ein Bewusstsein davon zu
vermitteln, was das gesamte System schlie ßlich leisten soll. Die Erforschungs-
phase umfasst drei Spielzüge:
Eine Storycard schreiben  – Die Gesch äftsseite erstellt eine Storycard, die etwas
beschreibt, was das System leisten soll. Die Leistungsmerkmale werden auf Kar-
teikarten geschrieben, die benannt werden und einen kurzen Absatz mit dem
Zweck der Leistungsmerkmale enthalten.
--- PAGE 110 ---
90 15 Planungsstrategie
Eine Storycard einschätzen – Die Entwicklung schätzt ein, wie lange es dauern wird,
die Leistungsmerkmale zu implementieren. Wenn die Entwicklung ein auf einer
Storycard beschriebenes Leistungsmerkmal nicht einschätzen kann, kann sie sich
an die Gesch äftsseite wenden, die die Storycard n äher erläutern oder aufteilen
kann. Eine einfache Methode zur Einschätzung eines Leistungsmerkmals besteht
in der Frage: »Wie lange werde ich brauchen, um dies zu implementieren, wenn
ich nichts anderes implementieren muss, nicht unterbrochen werde und keine
Meetings habe.« In XP nennt man dies die ideale Entwicklungszeit (engl. Ideal
Engineering Time). Wie Sie sp äter (im Abschnitt »Verpflichtungsphase« unter
dem Punkt »Geschwindigkeit festlegen«) sehen werden, errechnen Sie ein Ver-
hältnis zwischen der idealen Zeit und der Kalenderzeit, bevor Sie sich zu einem
bestimmten Terminplan verpflichten.
Eine Storycard aufteilen – Wenn die Entwicklung nicht die gesamte Storycard ein-
schätzen kann oder wenn die Gesch äftsseite erkennt, dass ein Teil der Storycard
weniger wichtig als andere Teile ist, dann kann die Gesch äftsseite eine Storycard
in zwei oder mehr Storycards aufteilen.
Verpflichtungsphase
Zweck der Verpflichtungsphase ist es, dass die Gesch äftsseite den Umfang und
das Datum der nächsten Version festlegt und dass die Entwicklung sich dazu ver-
pflichtet, dies zu liefern. Die Verpflichtungsphase umfasst vier Spielzüge.
Nach Wert sortieren  – Die Gesch äftsseite teilt die Storycards auf drei Stapel auf:
(1) die Leistungsmerkmale, ohne die das System nicht funktioniert, (2) die Leis-
tungsmerkmale, die weniger wichtiger sind, aber entscheidenden Gesch äftsge-
winn liefern und (3) die Leistungsmerkmale, die w ünschenswert, aber nicht
unbedingt erforderlich sind.
Nach Risiko sortieren  – Die Entwicklung teilt die Storycards auf drei Stapel auf:
(1) die Leistungsmerkmale, die sie genau einsch ätzen kann, (2) die Leistungs-
merkmale, die sie halbwegs einschätzen kann und (3) die Leistungsmerkmale, die
sie überhaupt nicht einschätzen kann.
Geschwindigkeit festlegen  – Die Entwicklung teilt der Gesch äftsseite mit, wie
schnell das Team in idealer Entwicklungszeit pro Kalendermonat programmieren
kann.
Umfang festlegen – Die Gesch äftsseite wählt die Storycards f ür eine Version aus,
indem sie entweder ein Datum festlegt, an dem die Entwicklung abgeschlossen
sein muss, und Karten anhand der Aufwandsschätzung und der Projektgeschwin-
digkeit auswählt oder indem sie Storycards auswählt und das Datum berechnet.
--- PAGE 111 ---
 Iterationsplanung 91
Steuerungsphase
Zweck der Steuerungsphase ist es, den Plan anhand der Erfahrungen der Entwick-
lung und der Gesch äftsseite zu aktualisieren. Die Steuerungsphase umfasst vier
Spielzüge.
Iteration – Am Beginn jeder Iteration (alle ein bis drei Wochen) w ählt die
Geschäftsseite die wichtigsten Elemente aus, die innerhalb einer Iteration imple-
mentiert werden k önnen. Die Elemente der ersten Iteration m üssen zu einem
System führen, das voll funktionsfähig ist, auch wenn es noch nicht ganz ausge-
reift ist.
Plankorrektur – Wenn die Entwicklung erkennt, dass es das eigene Tempo über-
schätzt hat, kann sie die Geschäftsseite fragen, welches, entsprechend den neuen
Angaben zu Geschwindigkeit und Aufwandssch ätzungen, die wertvollste Menge
von Leistungsmerkmalen (Storycards) ist, die in der aktuellen Version enthalten
sein soll.
Neues Leistungsmerkmal  – Wenn die Gesch äftsseite mitten in der Entwicklung
einer Version erkennt, dass sie ein neues Leistungsmerkmal braucht, dann kann
sie die Storycard schreiben. Die Entwicklung sch ätzt die Storycard ein und die
Geschäftsseite entfernt Storycards mit den jeweiligen Aufwandssch ätzungen aus
dem verbleibenden Plan und fügt die neue Storycard ein.
Neueinschätzung des Aufwands – Wenn die Entwicklung den Eindruck hat, dass
der Plan den Entwicklungsverlauf nicht mehr genau beschreibt, dann kann sie
alle verbleibenden Aufgaben neu einschätzen und die Geschwindigkeit neu fest-
legen.
Iterationsplanung
Das oben beschriebene Planungsspiel versetzt den Kunden in die Lage, alle drei
Wochen in die Entwicklung lenkend einzugreifen. Innerhalb einer Iteration setzt
die Entwicklung nahezu die gleichen Regeln ein, um ihre Aktivitäten zu planen.
Das Iterationsplanungsspiel ähnelt dem Planungsspiel, insofern auch hier mit
Karten gespielt wird. Diesmal handelt es sich jedoch um Taskcards statt Story-
cards. Die einzelnen Programmierer sind die Spieler. Die Zeitskala ist kürzer – das
gesamte Spiel dauert eine Iteration (ein bis vier Wochen) lang. Die Phasen und
Spielzüge sind ähnlich.
--- PAGE 112 ---
92 15 Planungsstrategie
Erforschungsphase
Eine Aufgabe beschreiben – Man nimmt die Storycards einer Iteration und macht
Taskcards (Aufgaben) daraus. Im Allgemeinen umfassen die Aufgaben nicht die
gesamte Storycard, da man ein ganzes Leistungsmerkmal nicht in einigen weni-
gen Tagen implementieren kann. Gelegentlich unterstützt eine Aufgabe mehrere
Leistungsmerkmale. Manchmal bezieht sich eine Aufgabe nicht direkt auf ein
bestimmtes Leistungsmerkmal, z.B. die Umstellung auf eine neue Version von
Systemsoftware. Abbildung 15.2 zeigt ein Beispiel für eine echte Taskcard.
Eine Aufgabe aufteilen/Aufgaben kombinieren  – Wenn man meint, dass sich eine
Aufgabe nicht innerhalb einiger Tage erledigen l ässt, teilt man sie in kleinere
Aufgaben auf. Wenn sich verschiedene Aufgaben in jeweils nur eine Stunde erle-
digen lassen, kombiniert man sie zu einer umfangreicheren Aufgabe.
Verpflichtungsphase
Eine Aufgabe übernehmen – Die Programmierer übernehmen die Verantwortung
für die Erledigung bestimmter Aufgaben.
Eine Aufgabe einsch ätzen – Der verantwortliche Programmierer sch ätzt ein, wie
viele Tage idealer Entwicklungszeit zur Implementierung der einzelnen Aufgaben
erforderlich sind. Häufig hängt diese Einschätzung davon ab, ob man von ande-
ren Programmierern unterst ützt wird, die den Code m öglicherweise besser ken-
Abbildung 15.2  Eine Taskcard

--- PAGE 113 ---
 Iterationsplanung 93
nen. Aufgaben, die mehr als einige Tage beanspruchen, müssen aufgeteilt werden
(Sie müssen den genauen Schwellenwert selbst ermitteln, indem Sie Aufgaben,
die pünktlich erledigt wurden, mit solchen vergleichen, die nicht pünktlich erle-
digt wurden).
Sie nehmen vielleicht an, dass man die Auswirkungen des Programmierens in
Paaren in der Aufwandseinsch ätzung berücksichtigen muss. Ignorieren Sie das.
Die Zeit, die Sie damit verbringen, anderen Programmierern zu helfen, mit dem
Kunden zu sprechen und an Sitzungen teilzunehmen, schlägt sich im Belastungs-
faktor nieder.
Belastungsfaktor festlegen – Jeder Programmierer setzt seinen Belastungsfaktor f ür
die Iteration fest, welchen Prozentanteil seiner Zeit er also wirklich f ür das Pro-
grammieren aufwenden kann. Es handelt sich hierbei um einen Messwert – das
Verhältnis zwischen Tagen idealer Entwicklungszeit und Kalendertagen. Wenn
Sie w ährend der letzten drei Iterationen Aufgaben mit einer idealen Entwick-
lungszeit von 6, 8 und 7,5 Tagen fertig gestellt haben, dann sollten Sie sich f ür
diese Iteration f ür diese Aufgabenmenge verpflichten. Die ideale Entwicklungs-
zeit f ür Aufgaben pro Iteration kann bei neuen Teammitgliedern oder Coachs
relativ gering sein, z.B. zwei oder drei Tage w ährend einer dreiw öchigen Itera-
tion. Sie sollte bei allen Teammitgliedern h öher als 7 oder 8 sein, da diese
ansonsten nicht genügend zum Team beitragen.
Belastungsausgleich – Jeder Programmierer addiert seine Aufgabensch ätzungen
und multipliziert diese mit dem Belastungsfaktor. Programmierer, die sich zu viel
aufgebürdet haben, müssen Aufgaben abgeben. Wenn das gesamte Team überlas-
tet ist, dann muss es einen Ausgleich finden (siehe nachfolgenden Punkt Plankor-
rektur).
Steuerungsphase
Eine Aufgabe implementieren – Der Programmierer übernimmt eine Aufgabe, sucht
sich einen Partner, schreibt die Testfälle für diese Aufgabe, bringt diese zum Lau-
fen, integriert und gibt den neuen Code frei, sobald die allgemeine Testreihe feh-
lerfrei ausgeführt wird. 
Arbeitsfortschritt protokollieren – Alle zwei oder drei Tage fragt ein Teammitglied
jeden Programmierer, wie lange er f ür jede seiner Aufgaben gebraucht hat und
wie viele Tage er noch übrig hat.
Plankorrektur – Programmierer, die zu viele Aufgaben übernommen haben, bitten
um Unterst ützung, indem sie (1) den Umfang einiger Aufgaben reduzieren,
(2) den Kunden bitten, den Umfang einiger Leistungsmerkmale (Storycards) zu
--- PAGE 114 ---
94 15 Planungsstrategie
reduzieren, (3) unwichtige Aufgaben verwerfen, (4) sich mehr oder bessere Unter-
stützung besorgen oder als letzten Ausweg (5) den Kunden bitten, einige Leis-
tungsmerkmale auf eine spätere Iteration zu verschieben.
Leistungsmerkmal verifizieren – Sobald die Funktionstests fertig und die Aufgaben
für ein Leistungsmerkmal erledigt sind, werden die Tests ausgef ührt, um die
Funktionsfähigkeit des Leistungsmerkmals zu verifizieren. Interessante F älle, die
sich während der Implementierung ergeben haben, k önnen den Funktionstests
hinzugefügt werden.
Die Unterschiede zwischen der Planung einer Iteration und der Planung einer
Version bestehen vorwiegend darin, dass man im Terminplan einer Iteration grö-
ßere Abweichungen tolerieren kann als im Terminplan einer Version, zu dem
man sich verpflichtet hat. Wenn innerhalb einer Iteration eine von drei Wochen
vergangen ist und der Arbeitsfortschritt nicht den Erwartungen entspricht, dann
ist es durchaus möglich, einen Tag auszusetzen und diesen für ein gemeinschaft-
liches Refactoring aufzuwenden, das f ür den Arbeitsfortschritt aller erforderlich
ist. Kein Programmierer wird hier den Eindruck gewinnen, das gesamte Projekt
würde nun auseinander fallen (zumindest nicht, wenn er über etwas Erfahrung
verfügt). Würden die Kunden solche anscheinend drastischen Änderungen täg-
lich mitbekommen, würden sie jedoch rasch nervös werden.
Es mag vielleicht den Anschein machen, als würde man lügen, da man einen Teil
des Entwicklungsprozesses vor dem Kunden verbirgt. Es ist wichtig, dass sich dies
nicht bewahrheitet. Sie verheimlichen nicht absichtlich etwas. Wenn der Kunde
einen Tag lang dem Refactoring zuschauen möchte, dann kann er dies gerne tun,
auch wenn er wahrscheinlich Wichtigeres zu erledigen hat. Die Unterscheidung
zwischen Inter- und Intraiterationsplanung ist eine Erweiterung des Prinzips der
Trennung von gesch äftlichen und technischen Entscheidungen. Es gibt Ände-
rungen auf einer bestimmten Detailebene, die f ür die Geschäftsseite nicht mehr
von Belang sind – Programmierer wissen ihre Zeit besser einzuteilen, als es
irgendein Repräsentant der Geschäftsseite könnte.
Ein Unterschied zwischen dem Planungsspiel und dem Iterationsplanungsspiel
besteht darin, dass die Programmierer sich zu Aufgaben verpflichten, bevor sie
deren Aufwand einsch ätzen. Das Team übernimmt implizit Verantwortung f ür
die Leistungsmerkmale und daher sollten die Einsch ätzungen vom Team
gemeinsam vorgenommen werden. Einzelne Programmierer übernehmen die
Verantwortung f ür bestimmte Aufgaben und daher sollten sie diese Aufgaben
selbst einschätzen.
--- PAGE 115 ---
 Iterationsplanung 95
Eine weitere Eigenheit der Iterationsplanung ist, dass einige Aufgaben nicht
direkt mit den Anforderungen des Kunden in Beziehung stehen. Wenn jemand
die Integrationstools verbessern muss und diese Aufgabe so aufw ändig ist, dass
sie sich nicht in der Entwicklung verbergen l ässt, dann wird daraus eine eigene
Aufgabe, die zusammen mit den anderen Aufgaben Priorit ät erhält und geplant
wird.
Sehen wir uns noch einmal die Zw änge des Iterationsplanungsprozesses an und
wie die oben beschriebene Strategie darauf eingeht.
 Man sollte nicht allzu viel Zeit mit dem Planen verbringen, da sich die Wirk-
lichkeit nie genau an den Plan h ält. Ein halber Tag von f ünfzehn Tagen ist
nicht zu viel Aufwand. Nat ürlich wäre es besser, wenn Sie diesen Zeitraum
verringern könnten, aber er fällt nicht wirklich ins Gewicht.
 Man möchte ein unmittelbares Feedback zur eigenen Arbeit, damit man nach
einem Drittel der Planungszeit wei ß, ob man in Schwierigkeiten ist. Die Ant-
worten auf die Fragen, die von der Person gestellt werden, die den Arbeitsfort-
schritt protokolliert, sollten einem etwa nach der H älfte der Iteration einen
Eindruck davon vermitteln, ob man im Zeitplan liegt oder nicht. Dies gibt
einem häufig genügend Zeit, lokal auf das Problem zu reagieren, ohne den
Kunden bitten zu müssen, Änderungen vorzunehmen.
 Man möchte, dass derjenige, der etwas fertig stellt, auch f ür die betreffende
Aufwandsschätzung verantwortlich ist. Das funktioniert, solange die Pro-
grammierer Aufgaben übernehmen, bevor sie diese einschätzen.
 Man m öchte den Entwicklungsumfang auf das beschr änken, was wirklich
notwendig ist. Es kommt einem immer etwas komisch vor, wenn man sagt,
dass man in drei Wochen nur 7,5 Entwicklungstage arbeiten kann (15 Tage
geteilt durch einen gemessenen Belastungsfaktor von 2). Es stellt sich jedoch
heraus, dass dies wahr ist, wenn man mehr Erfahrung beim Treffen von Auf-
wandsschätzungen gewinnt. Das Gefühl, dass man eigentlich gar nicht so viel
arbeitet, veranlasst einen, mehr Aufgaben übernehmen zu wollen. Man wei ß
jedoch, dass man Standards einhalten und Qualit ät liefern muss, wenn man
dies tut (und man hat einen Partner, der auf den gleichen Bildschirm blickt
und sicherstellt, dass man Qualität liefert). Man tendiert also dazu, einfach zu
arbeiten, und kann immer noch behaupten, dass man die Aufgabe erledigt
hat.
 Man möchte einen Prozess, der nicht so viel Druck erzeugt, dass Leute Dinge
tun, die sich als dumm erweisen, nur um einen kurzfristigen Plan zu erfüllen.
Dies läuft wiederum darauf hinaus, dass man sagt, man kann 7,5 Tage Arbeit
--- PAGE 116 ---
96 15 Planungsstrategie
leisten. Man kann einfach nicht viele Aufgaben übernehmen. Wenn man
eine Iteration bearbeitet hat, dann erh ält man oft das Feedback, dass man
nicht hätte versuchen sollen, sich so viel aufzubürden. Man wiederholt diesen
Fehler also nicht noch einmal. Dies resultiert darin, dass man sich in etwa zu
so viel verpflichtet, wie man leisten kann, ohne an der Qualit ät Abstriche zu
machen.
Bei kleineren Projekten lasse ich die Iterationsplanung sein. Sie ist sicher notwen-
dig, um die Arbeit von zehn Programmierern zu koordinieren. Zur Koordination
der Arbeit von zwei Programmierern ist sie dagegen nicht notwendig. Abh ängig
vom Projekt, werden Sie feststellen, dass der Koordinationsbedarf den f ür eine
formale Iterationsplanung erforderlichen Aufwand rechtfertigen kann.
In einer Woche planen
Wie kann man ein Projekt planen, wenn man nur eine Woche Zeit hat? Diese
Situation stellt sich f ür Teams h äufig ein, die Festpreisangebote machen. Man
erhält eine Anfrage und muss innerhalb einer Woche darauf antworten. Man hat
nicht genügend Zeit, um einen kompletten Satz an Storycards zu schreiben, die
man jeweils einschätzen und testen kann. Man hat nicht die Zeit, Prototypen zu
erstellen, damit man die Leistungsmerkmale vor dem Hintergrund von ersten
Erfahrungen einschätzen kann.
Die XP-Lösung besteht darin, mehr Risiken im Plan zu akzeptieren, indem man
umfangreichere Leistungsmerkmale einbaut. Man schreibt Storycards, deren Auf-
wand man in Monaten idealer Programmierzeit statt in Wochen idealer Program-
mierzeit einsch ätzen kann. Man kann dem Kunden die Gelegenheit geben,
Abstriche zu machen, indem er einige Storycards verkleinert oder aufschiebt, so
wie man dies auch im normalen Planungsspiel tun würde.
Aufwandsschätzungen sollten auf Erfahrungswerten basieren. Anders als im Pla-
nungsspiel hat man nicht die Zeit, Erfahrungswerte zu sammeln, wenn man
innerhalb einer Woche auf einen Vorschlag reagieren soll. Schätzungen beruhen
dann auf Erfahrungen, die man fr üher bei der Erstellung ähnlicher Systeme
gesammelt hat. Hat man keine einschlägigen Erfahrungen, weil man keine ähnli-
chen Systeme erstellt hat, dann sollte man lieber kein Festpreisangebot machen.
Sobald man den Vertrag unterzeichnet hat, sollte man zur ückgehen und die
Anfangsphasen des Planungsspiels spielen und auf diese Weise sofort gegenpr ü-
fen, inwieweit man in der Lage ist, den Vertrag zu erfüllen.
--- PAGE 117 ---
16 Entwicklungsstrategie
Im Unterschied zur Managementstrategie stellt die Entwicklungsstrategie eine radikale
Abkehr vom traditionellen Denken dar – wir werden heute für das heutige Problem eine
Lösung entwickeln und darauf vertrauen, dass wir die morgigen Probleme morgen lösen
können.
XP verwendet die Metapher des Programmierens für seine Aktivitäten, d.h., alles,
was man tut, sieht in gewisser Weise wie das Programmieren aus. In XP zu pro-
grammieren gleicht dem üblichen Programmieren, wobei einige Kleinigkeiten
hinzugefügt werden, wie das automatisierte Testen. Wie die übrigen Elemente
von XP ist die XP-Entwicklung jedoch trügerisch einfach. Sämtliche Teile lassen
sich einfach erklären, aber es ist schwierig, sie auszuführen. Furcht macht sich
breit. Unter Druck schleichen sich alte Gewohnheiten wieder ein.
Die Entwicklungsstrategie beginnt mit der Iterationsplanung. Fortlaufende Inte-
gration verringert Entwicklungskonflikte und sorgt für einen natürlichen
Abschluss einer Entwicklungsepisode. Die gemeinsame getragene Verantwortung
ermutigt das gesamte Team dazu, das gesamte System zu verbessern. Schließlich
bindet das Programmieren in Paaren den gesamten Prozess zu einer Einheit
zusammen.
Fortlaufende Integration
Jeder Code wird innerhalb von einigen Stunden integriert. Am Ende jeder Ent-
wicklungsepisode wird der Code in die neueste Version integriert und alle Tests
werden zu 100% fehlerfrei ausgeführt.
Im Extremfall fortlaufender Integration würde sich jede Änderung, die ein Pro-
grammierer vornimmt, sofort im Code aller anderen Programmierer widerspie-
geln. Von der Infrastruktur und der Bandbreite, die dazu erforderlich wären, ein-
mal abgesehen, würde dies nicht gut funktionieren. Während man entwickelt,
tut man gerne so, als sei man der einzige Programmierer im Projekt. Man möchte
mit voller Geschwindigkeit voranschreiten und die Beziehungen zwischen den
Änderungen, die man selbst vornimmt, und den Änderungen, die ein anderer
zufällig ausführt, ignorieren. Würden Änderungen stattfinden, die man nicht
unmittelbar unter Kontrolle hat, würde das diese Illusion zerstören.
Alle paar Stunden zu integrieren (mindestens einmal am Tag) bietet die Vorteile
beider Stile – einzelner Programmierer und sofortige Integration. Während Sie
entwickeln, können Sie sich so verhalten, als wären Sie und Ihr Partner die einzi-
--- PAGE 118 ---
98 16 Entwicklungsstrategie
gen Programmierer im Projekt. Sie k önnen nach Belieben Änderungen vorneh-
men. Dann tauschen Sie die Rollen. Als Integrator wird Ihnen bewusst (die Tools
zeigen Ihnen dies), wo Konflikte in der Definition von Klassen oder Methoden
bestehen. Durch die Durchf ührung der Tests werden Sie auf semantische Kon-
flikte aufmerksam.
Würde die Integration einige Stunden dauern, dann wäre es nicht möglich, so zu
arbeiten. Es ist wichtig, Tools zu haben, die einen raschen Zyklus von Integra-
tion, Erstellen und Testen erm öglichen. Sie brauchen zudem eine einigerma ßen
vollständige Testreihe, die sich in einigen Minuten ausf ühren lässt. Man kann
sich nicht genug bemühen, Konflikte zu lösen.
Dies ist kein Problem. St ändiges Refactoring hat den Effekt, dass das System in
eine Menge kleiner Objekte und eine Menge kleiner Methoden aufgeteilt wird.
Damit wird die Wahrscheinlichkeit verringert, dass zwei Programmiererpaare die
gleiche Klasse oder Methode zur selben Zeit ändern. Sollte dieser Fall eintreten,
lassen sich die Änderungen mit geringem Aufwand aufeinander abstimmen, da
jede Änderung nur einige Stunden Entwicklungszeit bedeutet.
Ein weiterer wichtiger Grund, die Kosten fortlaufender Integration in Kauf zu
nehmen, besteht darin, dass damit das Projektrisiko stark verringert wird. Wenn
zwei Programmierer über das Aussehen oder das Verhalten eines Codefragments
unterschiedlicher Meinung sind, dann wissen sie innerhalb von Stunden, wer
Recht hat. Sie werden nicht mehr tagelang einen Bug suchen, der sich irgend-
wann in den letzten Wochen eingeschlichen hat. Und die Übung, die man in der
Integration bekommen hat, kommt beim Erstellen des endg ültigen Projekts sehr
gelegen. Der »Production Build« ist dann keine gro ße Sache mehr. Wenn es so
weit ist, kann das jedes Teammitglied im Schlaf erledigen, da man es monatelang
täglich geübt hat.
Fortlaufende Integration hat w ährend der Entwicklung auch einen gro ßen
menschlichen Vorteil. Wenn man mitten in der Arbeit an einer Aufgabe steckt,
hat man tausend Dinge im Kopf. Indem man bis zu einem nat ürlichen Schnitt-
punkt arbeitet – es befinden sich keine kleinen Aufgaben mehr auf der To-do-
Karte – und dann integriert, bringt man einen Rhythmus in die Entwicklung.
Lernen/Testen/Programmieren/Freigeben. Das ist fast so wie das Atmen. Sie ent-
wickeln eine Idee, drücken sie aus und f ügen sie dem System hinzu. Nun ist der
Kopf frei, bereit für die nächste Idee.
Von Zeit zu Zeit zwingt einen die fortlaufende Integration dazu, die Implemen-
tierung einer Aufgabe in zwei Episoden aufzuteilen. Wir akzeptieren den dadurch
bedingten Zusatzaufwand, n ämlich uns daran erinnern zu m üssen, was bereits
erledigt worden ist und was noch zu tun bleibt. Mittlerweile hat man vielleicht
--- PAGE 119 ---
 Gemeinsame Verantwortlichkeit 99
einige Erkenntnisse darüber gewonnen, warum die erste Episode so langsam von-
statten ging. Man beginnt die n ächste Episode mit etwas Refactoring und der
restliche Teil der zweiten Episode verläuft viel reibungsloser.
Gemeinsame Verantwortlichkeit
Mit gemeinsamer Verantwortlichkeit ist diese anscheinend verr ückte Idee
gemeint, dass jeder zu jedem Zeitpunkt jedes beliebige Codeelement des Systems
ändern kann. Ohne Tests w äre ein solches Vorgehen, schlicht Selbstmord. Mit
den Tests und der Qualit ät der Tests, die man erh ält, wenn man einige Monate
lang sehr viele Tests geschrieben hat, kann das klappen. Es kann klappen, wenn
jede Integration nur Änderungen im Umfang einiger Stunden Programmierarbeit
umfasst. Das ist natürlich genau das, was wir tun werden.
Einer der Effekte gemeinsamer Verantwortlichkeit ist, dass sich komplizierter
Code nicht sehr lange hält. Da jeder gewohnt ist, das gesamte System zu inspizie-
ren, wird dieser Code eher fr üh als sp ät entdeckt. Und wenn er gefunden wird,
dann wird jemand versuchen, ihn zu vereinfachen. Wenn die Vereinfachung
nicht funktioniert, was durch scheiternde Tests evident wird, dann wirft man
den Code weg. Auch dann wird es noch jemanden au ßer dem eigentlichen Pro-
grammiererpaar geben, der versteht, warum dieser Code möglicherweise so kom-
pliziert sein muss. In der Mehrheit der F älle funktioniert die Vereinfachung
jedoch oder Teile davon funktionieren.
Gemeinsame Verantwortlichkeit trägt dazu bei, dass komplizierter Code erst gar
nicht in das System eingeführt wird. Wenn man weiß, dass sich ein anderer bald
(in einigen Stunden) das anschaut, was man gerade schreibt, dann überlegt man
es sich zweimal, bevor man etwas Kompliziertes einfügt, was sich nicht unmittel-
bar rechtfertigen lässt.
Gemeinsame Verantwortlichkeit st ärkt das Gef ühl pers önlicher Einflussnahme
auf ein Projekt. In einem XP-Projekt muss man sich nie mit der Dummheit eines
anderen herum ärgern. Man sieht ein Hindernis und r äumt es aus dem Weg.
Wenn Sie entscheiden, etwas im Moment zu akzeptieren, weil es zweckmäßig ist,
dann ist das Ihre Sache. Sie haben jedoch immer eine Alternative. Sie bekommen
daher nie das Gefühl: »Ich könnte meine Arbeit erledigen, wenn ich mich nicht
mit den Idiotien der anderen herumschlagen m üsste.« Eine Frustration weniger.
Ein Schritt näher an klarerem Denken.
Gemeinsame Verantwortlichkeit f ührt auch dazu, Wissen über das System im
Team zu verteilen. Es ist unwahrscheinlich, dass es jemals einen Teil des Systems
gibt, den nur zwei Leute kennen (es muss zumindest ein Paar sein, was bereits
--- PAGE 120 ---
100 16 Entwicklungsstrategie
besser ist als in der herk ömmlichen Situation, in der ein intelligenter Program-
mierer alle übrigen als Geiseln h ält). Dadurch wird das Projektrisiko weiter ver-
ringert.
Programmieren in Paaren
Das Programmieren in Paaren verdient eigentlich ein eigenes Buch. Es ist eine
ganz besondere Fertigkeit, eine Fertigkeit, die man den Rest seines Lebens lang
einüben kann. In diesem Kapitel sehen wir uns lediglich an, welche Rolle das
Programmieren in Paaren in XP spielt.
Zuerst einige Worte dazu, was das Programmieren in Paaren nicht ist. Gemeint
ist damit nicht, dass eine Person programmiert, w ährend die andere zuschaut.
Einfach zuzusehen, wie jemand programmiert, ist ungef ähr genauso interessant,
wie dem Gras beim Wachsen zuzusehen. Das Programmieren in Paaren ist ein
Dialog zwischen zwei Personen, die gleichzeitig zu programmieren (und zu ana-
lysieren, zu entwerfen und zu testen) und zu lernen versuchen, wie man besser
programmiert. Es ist eine auf vielen Ebenen stattfindende Konversation, die
durch einen Computer gestützt wird und sich auf einen Computer konzentriert.
Das Programmieren in Paaren ist auch keine Nachhilfestunde. Manchmal verfügt
einer der Partner über mehr Erfahrung als der andere. Wenn dies zutrifft, dann se-
hen die ersten Sitzungen sehr nach Nachhilfestunden aus. Der Juniorpartner wird
eine Menge Fragen stellen und sehr wenig tippen. Sehr rasch wird der Juniorpart-
ner jedoch Flüchtigkeitsfehler bemerken und verhindern helfen, wie z.B. fehlende
Klammern. Der Seniorpartner nimmt die Unterstützung wahr. Nach einigen Wo-
chen beginnt der Juniorpartner die gr ößeren Muster zu erkennen, die der erfah-
rene Partner verwendet, und bemerkt Abweichungen von diesen Mustern.
Nach einigen Monaten merkt man den Unterschied zwischen den Partnern in
der Regel lange nicht mehr so wie am Anfang. Der Juniorpartner wird dann regel-
mäßiger an der Tastatur sitzen. Die beiden erkennen, dass jeder von ihnen
bestimmte Stärken und Schw ächen hat. Produktivit ät, Qualität und Zufrieden-
heit steigen.
Beim Programmieren in Paaren geht es nicht darum, untrennbar miteinander ver-
bunden zu sein. Wenn Sie sich Kapitel 2, »Eine Entwicklungsepisode«, in Erinne-
rung rufen, dann wissen Sie, dass ich zuallererst um Hilfe gebeten habe. Manchmal
sucht man einen bestimmten Partner, wenn man eine Aufgabe beginnt. Üblicher
ist es jedoch, dass man einfach jemanden findet, der verf ügbar ist. Und wenn
beide Partner Aufgaben zu erledigen haben, dann einigt man sich darauf, am Mor-
gen an einer Aufgabe und am Nachmittag an der anderen zu arbeiten.
--- PAGE 121 ---
 Programmieren in Paaren 101
Was passiert, wenn zwei Programmierer einfach nicht miteinander auskommen?
Sie m üssen kein Paar bilden. Wenn zwei Personen nicht miteinander arbeiten
können, dann wird es f ür die anderen etwas schwieriger, Paare zu bilden. Liegt
jedoch ein wirklich ernstes zwischenmenschliches Problem vor, dann ist es bes-
ser, einige Minuten f ür Partnerwechsel aufzuwenden, als einen Faustkampf zu
riskieren.
Was passiert, wenn sich Leute weigern, Paare zu bilden? Sie haben die Wahl, zu
lernen, wie die anderen Teammitglieder zu arbeiten, oder sich nach Arbeit außer-
halb des Teams umzusehen. XP ist nicht f ür jeden geeignet und nicht jeder eig-
net sich für XP. Es ist jedoch nicht so, dass man ab dem ersten Tag in einem XP-
Team als Programmierpartner arbeiten muss. Wie überall sonst auch, arbeitet
man schrittweise darauf hin. Man versucht es eine Stunde lang. Wenn es nicht
funktioniert, versucht man herauszufinden, was falsch lief, und versucht es
nochmals eine Stunde lang.
Warum eignet sich das Programmieren in Paaren f ür XP? Nun, der erste Wert ist
Kommunikation, und es gibt wenige Formen der Kommunikation, die intensiver
sind, als sich Auge in Auge gegenüberzusitzen. Das Programmieren in Paaren eig-
net sich also für XP, weil es die Kommunikation fördert. Ich gebrauche gern den
Vergleich mit einem Wasserbecken. Wenn jemand im Team eine wichtige neue
Information findet, dann ist das so, als würde man einen Tropfen Farbstoff in ein
Wasserbecken geben. Da die Paarungen st ändig wechseln, wird die Information
rasch im Team verbreitet, ebenso wie sich der Farbstoff rasch im Wasserbecken
verteilt. Im Gegensatz zum Farbstoff wird die Information w ährend der Verbrei-
tung jedoch dichter, da in sie noch die Erfahrung und die Erkenntnisse aller
Teammitglieder eingehen.
Meiner Erfahrung nach ist es produktiver, paarweise zu programmieren, als die
Arbeit zwischen zwei Programmierern aufzuteilen und die Ergebnisse dann
zusammenzuführen. Für Leute, die XP anwenden wollen, ist das Programmieren
in Paaren h äufig eine H ürde. Ich kann dazu nur sagen, man sollte sich darin
üben und dann eine Iteration ausprobieren, bei der der ganze Produktionscode
von Paaren programmiert wird, und eine andere, bei der alles von Einzelk ämp-
fern programmiert wird. Dann kann man sich selbst ein Bild machen und ent-
scheiden.
Auch wenn man nicht produktiver w äre, sollte man trotzdem in Paaren pro-
grammieren, da der resultierende Code von viel h öherer Qualität ist. W ährend
ein Partner fleißig tippt, denkt der andere Partner über die Strategie nach. Wohin
führt diese Entwicklungslinie? F ührt sie in eine Sackgasse? Gibt es eine bessere
allgemeine Strategie? Gibt es eine Möglichkeit zum Refactoring?
--- PAGE 122 ---
102 16 Entwicklungsstrategie
Ein weiteres wichtiges Merkmal des Programmierens in Paaren besteht darin,
dass einige der Verfahren nicht ohne es funktionieren würden. Unter Stress kehrt
man wieder zu alten Verhaltensmustern zur ück. Man h ört auf, Tests zu schrei-
ben. Man verschiebt das Refactoring. Gibt es allerdings einen Partner, der
zuschaut, dann ist es wahrscheinlich, dass der Partner einen davon abhält, wenn
man eines dieser Verfahren über Bord werfen möchte. Das soll nicht heißen, dass
Paare keine Fehler machen. Paare machen sicherlich Fehler, ansonsten bräuchten
sie keinen Coach. Wenn man in Paaren programmiert, dann ist es jedoch viel
weniger wahrscheinlich, dass man seine Verpflichtung gegen über dem Team
ignoriert, als wenn man alleine arbeitet.
Die kommunikative Natur des Programmierens in Paaren bringt zudem den Ent-
wicklungsprozess voran. Man lernt rasch, auf vielen verschiedenen Ebenen zu
kommunizieren – dieser Code hier, jener Code irgendwo anders im System, Ent-
wicklungsepisoden wie diese in der Vergangenheit, Systeme wie dieses aus frühe-
ren Jahren, die verwendeten Verfahren und wie man sie verbessern kann.
--- PAGE 123 ---
17 Designstrategie
Wir werden das Design des Systems fortwährend verfeinern, wobei wir mit einem sehr
einfachen Design beginnen. Es soll keine unnötige Flexibilität geben.
In vielerlei Hinsicht ist dieses Kapitel am schwierigsten zu schreiben. Die
Designstrategie von XP lautet, stets das einfachste Design zu verwenden, mit
dem sich die aktuelle Testreihe fehlerfrei ausführen lässt.
Nun, das ging ja noch. Was ist an Einfachheit falsch? Was ist mit Testreihen
nicht in Ordnung?
Die einfachste Lösung
Wir wollen einen Schritt zurücktreten und uns dieser Antwort langsam nähern.
Alle vier Werte tragen zu dieser Strategie bei:
 Kommunikation – Ein kompliziertes Design lässt sich schwieriger vermitteln als
ein einfaches. Wir sollten daher eine Designstrategie verfolgen, die ein mög-
lichst einfaches Design ermöglicht, das mit den übrigen Zielen konsistent ist.
Andererseits sollten wir eine Designstrategie verfolgen, die kommunikative
Designs fördert, bei denen Designelemente einem Leser über wichtige Aspekte
des Systems Aufschluss geben.
 Einfachheit – Wir sollten eine Designstrategie verfolgen, die nicht nur ein ein-
faches Design ergibt, sondern selbst auch einfach ist. Das heißt nicht, dass
diese Strategie einfach zu verfolgen sein muss. Gutes Design ist nie einfach.
Aber der Ausdruck dieser Strategie sollte einfach sein.
 Feedback – Bevor ich begann, XP zu praktizieren, hatte ich beim Entwurf eines
Designs immer das Problem, dass ich nicht wusste, wann ich richtig und
wann ich falsch lag. Je länger ich an einem Design arbeitete, desto schwerer
wog dieses Problem. Ein einfaches Design löst dieses Problem, da es rasch ent-
worfen wird. Anschließend schreibt man den Code und prüft, ob das Design
funktioniert.
 Mut – Was ist mutiger, als die Designphase möglichst kurz zu halten und
darauf zu vertrauen, dass man bei Bedarf im richtigen Moment mehr hinzufü-
gen kann?
Wenn wir uns an diese Werte halten, dann müssen wir
 eine Designstrategie entwerfen, die in einem einfachen Design resultiert
 einen raschen Weg finden, seine Qualität zu überprüfen
--- PAGE 124 ---
104 17 Designstrategie
 unsere Erfahrungen in das Design einfließen lassen
 die Zeitdauer dieses Prozesses auf ein Minimum reduzieren
Die Grundprinzipien haben auch Einfluss auf die Designstrategie.
Kleine Anfangsinvestition  – Wir sollten anfangs m öglichst wenig in das Design
investieren, bevor es sich auszahlt.
Einfachheit anstreben – Wir sollten unterstellen, dass das einfachste Design, von
dem wir uns vorstellen k önnen, dass es funktioniert, tats ächlich funktioniert.
Dies gibt uns die Zeit, gr ündlich zu arbeiten, falls das einfachste Design nicht
funktioniert. In der Zwischenzeit müssen wir nicht die Kosten zusätzlicher Kom-
plexität tragen.
Inkrementelle Veränderungen – Die Designstrategie wird mit allmählichen Verände-
rungen arbeiten. Wir werden das Design schrittweise entwickeln. Es wird keinen
Zeitpunkt geben, zu dem das System ein »fertiges Design « hat. Dieses Design
kann jederzeit geändert werden, obwohl es Teile im System geben wird, die eine
Weile unverändert bleiben.
Mit leichtem Gepäck reisen – Die Designstrategie sollte kein »überflüssiges« Design
produzieren. Das Design sollte den aktuellen Anforderungen genügen (der Anfor-
derung nach Qualitätsarbeit), aber nicht mehr bieten. Wenn wir Ver änderungen
begrüßen, dann sind wir gewillt, einfach zu beginnen und das Design immer
weiter zu verfeinern.
XP widerspricht den Instinkten vieler Programmierer. Als Programmierer sind
wir es gewohnt, Probleme zu erwarten. Wenn sich die Probleme später einstellen,
dann sind wir froh. Falls sie ausbleiben, bemerken wir es nicht. Die Designstrate-
gie muss daher diese Angewohnheit »Annahmen über die Zukunft zu machen «
umgehen. Gl ücklicherweise k önnen es sich die meisten Leute abgew öhnen,
»Probleme zu erfinden« (wie es meine Großmutter nannte). Leider wird es umso
schwieriger, sich dies abzugewöhnen, je intelligenter man ist.
Man kann diese Angelegenheit auch unter der Frage betrachten: »Wann f ügt
man mehr Design hinzu?« Eine übliche Antwort lautet, dass man ein Design f ür
die Zukunft entwerfen sollte (siehe Abbildung 17.1).
Diese Strategie funktioniert, wenn sich nichts zwischen dem aktuellen und
einem späteren Zeitpunkt ändert. Wenn man genau wei ß, was passieren wird,
und man genau wei ß, wie ein Problem zu l ösen ist, dann ist es im Allgemeinen
besser, das hinzuzuf ügen, was man jetzt braucht, und auch das hinzuzuf ügen,
was man später braucht.
--- PAGE 125 ---
 Die einfachste Lösung 105
Problematisch ist an dieser Strategie deren Unsicherheit:
 Manchmal kommt es nie zu dem sp äteren Zeitpunkt (das im Vorhinein ent-
worfene Leistungsmerkmal wird vom Kunden gestrichen).
 Manchmal findet man zwischen heute und einem späteren Zeitpunkt heraus,
wie man das Problem besser lösen kann.
In beiden F ällen muss man w ählen, ob man die Kosten f ür das Entfernen der
zusätzlichen Designelemente oder die laufenden Kosten f ür die Beibehaltung
eines komplizierteren Designs, das aktuell keinen Nutzen bringt, übernehmen
will.
Ich werde nie ausschließen, dass Änderungen vorkommen, und ich werde sicher-
lich nie die M öglichkeit ausschließen, dass ich etwas dazulernen werde. In die-
sem Fall müssen wir das Bild abändern, damit es widerspiegelt, dass wir heute ein
Design f ür die Anforderungen von heute entwerfen und morgen eines f ür die
Probleme von morgen, wie es Abbildung 17.2 zeigt.
Abbildung 17.1  Wenn die Kosten von Änderungen mit der Zeit drastisch ansteigen
Abbildung 17.2  Wenn die Änderungen kostengünstig bleiben
--- PAGE 126 ---
106 17 Designstrategie
Dies führt zu folgender Strategie.
1. Man beginnt mit einem Test, damit man wei ß, wann man fertig ist. Wir müs-
sen ein bestimmtes Ma ß an Design entwerfen, damit wir den Test schreiben
können: Welche Objekte gibt es und welche sichtbaren Methoden haben diese
Objekte?
2. Man entwirft und implementiert gerade so viel, um den Test zum Laufen zu
bringen. Man muss das Design der Implementierung in ausreichendem
Umfang entwerfen, um diesen Test und alle vorherigen Tests ausf ühren zu
können.
3. Man wiederholt diese Schritte.
4. Wenn man eine M öglichkeit sieht, das Design zu vereinfachen, tut man dies.
Im nachfolgenden Abschnitt »Was ist das Einfachste?« finden Sie eine Defini-
tion der hier anzuwendenden Prinzipien.
Diese Strategie mag l ächerlich einfach aussehen. Sie ist einfach, sie ist jedoch
nicht lächerlich. Damit lassen sich umfangreiche, ausgekl ügelte Systeme erstel-
len. Allerdings ist dies nicht einfach. Nicht ist schwieriger, als mit einem knap-
pen Terminplan zu arbeiten und sich trotzdem die Zeit zu nehmen, hinter sich
aufzuräumen.
Wenn man auf diese Weise ein Design entwirft, wird man etwas beim ersten Mal
auf eine sehr einfache Weise implementieren. Wenn man es dann das zweite Mal
verwendet, wird man es allgemeiner gestalten. Der erste Einsatz bringt nur das,
was unbedingt erforderlich ist. Der zweite Einsatz bringt Flexibilit ät. Auf diese
Weise investiert man nie in Flexibilität, die nicht benötigt wird, und man macht
das System dort flexibel, wo es f ür die dritte, vierte und f ünfte Variation flexibel
sein muss.
Wie funktioniert das Design durch Refactoring?
Diese Designstrategie wirkt während der Ausführung seltsam. Wir nehmen unse-
ren ersten Testfall. Wir sagen: »Wenn wir nur diesen einen Testfall implementie-
ren m üssten, dann br äuchten wir nur ein Objekt mit zwei Methoden. « Wir
implementieren das Objekt und die beiden Methoden. Und damit sind wir fertig.
Unser ganzes Design besteht aus einem Objekt -etwa eine Minute lang.
Dann nehmen wir uns den n ächsten Testfall vor. Wir k önnen für eine L ösung
einfach drauflosprogrammieren oder wir können das vorhandene Objekt in zwei
Objekte umstrukturieren. Zur Implementierung des Testfalls w ürde dann eines
--- PAGE 127 ---
 Wie funktioniert das Design durch Refactoring? 107
dieser Objekte ersetzt werden. Daher strukturieren wir zuerst um, dann f ühren
wir den ersten Testfall aus, um sicherzustellen, dass er funktioniert, und dann
implementieren wir den nächsten Testfall.
Nach ein oder zwei Tagen ist das System dann groß genug, dass man sich vorstel-
len kann, wie zwei Teams daran arbeiten, ohne sich st ändig gegenseitig in die
Quere zu kommen. Wir erhalten damit also zwei Paare, die gleichzeitig Testf älle
implementieren und regelm äßig (alle paar Stunden) ihre Änderungen integrie-
ren. Nach einem weiteren Tag oder zwei kann das System das gesamte Team
dabei unterstützen, auf diese Art zu entwickeln.
Von Zeit zu Zeit wird das Team das Gef ühl haben, dass es sich verfahren hat.
Vielleicht hat man eine konsistente Abweichung von den Aufwandsschätzungen
gemessen. Vielleicht bekommen die Teammitglieder ein flaues Gefühl im Magen,
wenn sie wissen, dass sie einen bestimmten Teil des Systems ändern müssen. Ist
dies der Fall, ruft jemand: »Die Zeit ist abgelaufen. « Das Team setzt sich einen
Tag lang zusammen und strukturiert das gesamte System um, indem es eine
Kombination aus CRC-Karten, Skizzen und Refactoring einsetzt.
Nicht jedes Refactoring lässt sich innerhalb weniger Minuten bew ältigen. Wenn
Sie entdecken, dass Sie eine gro ße verworrene Vererbungshierarchie geschaffen
haben, dann kann ein Monat konzentrierter Arbeit erforderlich sein, diese zu
entwirren. Sie k önnen aber keinen Monat konzentrierter Arbeit er übrigen. Sie
müssen Leistungsmerkmale für diese Iteration liefern.
Wenn umfangreiches Refactoring ansteht, dann geht man es in kleinen Schritten
an (inkrementelle Veränderungen auch hier). Sie befinden sich vielleicht mitten
in der Arbeit an einem Testfall und sehen eine M öglichkeit, sich einen weiteren
Schritt Ihrem gro ßen Ziel zu n ähern. Machen Sie diesen Schritt. Verlagern Sie
eine Methode hier und eine Variable dort. Schließlich bleibt von dem umfangrei-
chen Refactoring nur noch eine kleine Aufgabe übrig. Die k önnen Sie dann in
wenigen Minuten erledigen.
Abbildung 17.3  Modell für einen Vertrag mit Unterklassen für Versicherungsvertrag und Renten-
vertrag, der sich auf ein Produkt mit den Unterklassen Versicherungsprodukt und Rentenprodukt 
bezieht
--- PAGE 128 ---
108 17 Designstrategie
Ich habe bei einem System zur Verwaltung von Versicherungsvertr ägen Erfah-
rungen im schrittweisen Refactoring gesammelt. Das System hatte die in Abbil-
dung 17.3 gezeigte Hierarchie.
Dieses Design verstößt gegen die Regel »Einmal und nur einmal «. Daher began-
nen wir, auf das in Abbildung 17.4 dargestellte Design hinzuarbeiten.
In dem Jahr, in dem ich an diesem System arbeitete, haben wir uns in kleinen
Schritten auf das gew ünschte Design zubewegt. Wir verlagerten die Verantwort-
lichkeiten der Vertragsunterklassen auf die Funktion- oder die Produktunterklas-
sen. Am Ende meines Vertrags hatten wir die Vertragsunterklassen immer noch
nicht eliminiert, aber sie waren viel schlanker als am Anfang und eindeutig auf
dem Weg nach draußen. In der Zwischenzeit implementierten wir neue Funktio-
nalität.
Und das ist es. So entwerfen Sie in XP ein Design. Aus der XP-Perspektive ist
Design nicht, eine Reihe von Bildern zu zeichnen und das System dann so zu
implementieren, dass es diesen Bildern entspricht. Das w äre so, als w ürde man
mit dem Auto lediglich stur geradeaus fahren. Die Fahrstunde legt einen anderen
Designstil nahe – man l ässt das Auto an, dann lenkt man etwas in diese Rich-
tung, dann etwas in jene, dann wieder in diese.
Was ist das Einfachste?
Das beste Design ist also definiert als das einfachste Design, das alle Testf älle
besteht. Der Nutzen dieser Definition h ängt ab von der Frage, was mit dem Ein-
fachsten gemeint ist.
Ist das einfachste Design das mit den wenigsten Klassen? Dies würde zu Objekten
führen, die zu groß wären, um effizient zu sein. Ist das einfachste Design das mit
den wenigsten Methoden? Dies würde zu umfangreichen Methoden und Redun-
danzen führen. Ist das einfachste Design das mit den wenigsten Codezeilen? Dies
würde dazu führen, dass man sich um der Knappheit willen kurz fasst, und einen
Kommunikationsverlust bedeuten.
Abbildung 17.4  Vertrag bezieht sich auf eine Funktion, hat aber keine Unterklassen
--- PAGE 129 ---
 Wie kann das funktionieren? 109
Mit dem Einfachsten meine ich Folgendes – vier Bedingungen, die ihrem Stellen-
wert nach nach absteigend aufgeführt sind:
1. Das System (Code und Tests zusammengenommen) müssen all das vermitteln,
was man aussagen will.
2. Das System darf keinen redundanten Code enthalten (Punkt 1 und 2 ergeben
zusammen die Regel »Einmal und nur einmal«).
3. Das System soll die minimale Anzahl von Klassen haben.
4. Das System soll die minimale Anzahl von Methoden haben.
Zweck des Systemdesigns ist es erstens, die Absicht der Programmierer zu vermit-
teln, und zweitens, der Logik des Systems einen Lebensraum zu geben. Die oben
genannten Bedingungen stellen einen Rahmen zur Verf ügung, der diese beiden
Anforderungen erfüllt.
Wenn man das Design als Kommunikationsmittel betrachtet, dann wird man für
jedes wichtige Konzept Objekte und Methoden definieren. Man wird die Namen
der Klassen und Methoden so wählen, dass sie sich ergänzen.
Zum einen ist man zur Kommunikation gezwungen, zum anderen muss man
eine Möglichkeit finden, s ämtliche logischen Redundanzen aus dem System zu
entfernen. Dies ist für mich der schwerste Teil des Designs, da man zuerst Redun-
danzen aufspüren muss und dann einen Weg finden muss, diese zu entfernen.
Das Entfernen von Redundanzen f ührt dazu, dass man eine Menge kleiner
Objekte und Methoden erhält – alles andere führt unweigerlich zu Redundanzen.
Man erstellt aber nicht einfach zum Spa ß neue Objekte und Methoden. Sollten
Sie jemals auf eine Klasse oder eine Methode sto ßen, die nichts tut und nichts
vermittelt, dann löschen Sie sie.
Man kann diesen Prozess auch als Löschvorgang betrachten. Man hat ein System,
das Testfälle ausführt. Sie l öschen alles, was nicht zweckm äßig ist, also keinen
kommunikativen oder programmtechnischen Zweck erf üllt. Übrig bleibt dann
die einfachste Lösung.
Wie kann das funktionieren?
Die traditionelle Strategie daf ür, die Softwarekosten mit der Zeit zu reduzieren,
besteht darin, die Wahrscheinlichkeit und die Kosten von Überarbeitungen zu
verringern. XP verfolgt den genau umgekehrten Weg. Statt die H äufigkeit von
Überarbeitungen zu reduzieren, ergeht sich XP in Überarbeitungen. Ein Tag ohne
Refactoring ist wie ein Tag ohne Sonnenschein. Wieso kann das weniger kosten?
--- PAGE 130 ---
110 17 Designstrategie
Der Schlüssel ist, dass nicht nur Zeit Geld ist, sondern dass auch Risiko Geld ist.
Wenn man heute ein Designelement hinzufügt und es morgen verwendet, dann
stellt das einen Gewinn dar, da es weniger kostet, es heute hinzuzuf ügen. In
Kapitel 3, »Die Ökonomie der Softwareentwicklung «, wird jedoch behauptet,
dass diese Bewertung nicht vollständig ist. Wenn es genügend Unsicherheit gibt,
ist der Wert der Option des Abwartens so hoch, dass sich das Warten lohnt.
Das Design ist nicht kostenlos. Das System wird aufw ändiger, wenn man heute
zusätzliche Designelemente einbaut. Es gibt mehr zu testen, mehr zu verstehen
und mehr zu erklären. Daher zahlt man jeden Tag nicht nur Zinsen für das Geld,
das man ausgibt, sondern auch eine kleine Designabgabe. Wenn man dies im
Kopf beh ält, kann der Unterschied zwischen der heutigen Investition und der
Investition von morgen viel gr ößer sein und es ist trotzdem ratsam, morgen das
Design für die Probleme von morgen zu entwerfen.
Schlimmer ist noch das Risiko. Wie in Kapitel 3 erl äutert wurde, ist es praktisch
unmöglich, die Kosten von etwas einzuschätzen, was morgen passiert. Man muss
zudem die Wahrscheinlichkeit ber ücksichtigen, mit der das betreffende Ereignis
eintreten kann. Ich rate wirklich gern und liege damit nicht häufiger daneben als
irgendein anderer; ich habe jedoch entdeckt, dass ich weit weniger häufig richtig
tippe, als ich dachte. Häufig enthielt das wunderbare Design, das ich letztes Jahr
entwarf, fast überhaupt keine richtigen Vermutungen. Ich musste das gesamte
Design überarbeiten und das dauerte häufig zwei oder drei Wochen.
Die Kosten für eine heute getroffene Designentscheidung umfassen daher die Kos-
ten der Entscheidungsfindung plus den Zins für diesen Investitionsbetrag plus die
Trägheit, die das System dadurch gewinnt. Der Vorteil, heute eine Design-
entscheidung zu treffen, besteht in dem erwarteten Wert, den die Entscheidung
erhält, wenn das Design in der Zukunft Gewinn bringend verwendet wird.
Wenn die Kosten für die heutige Entscheidung hoch sind, wenn die Wahrschein-
lichkeit ihrer Verwendung gering ist und wenn die Wahrscheinlichkeit hoch ist,
dass man morgen eine bessere Alternative kennt, und wenn die Kosten f ür das
Hinzufügen des Designs morgen niedrig sind, dann liegt die Schlussfolgerung
nahe, dass wir niemals eine Designentscheidung zu einem Zeitpunkt treffen sol-
lenzu dem man sie nicht auch braucht. Das ist in der Tat die Schlussfolgerung, zu
der XP kommt. »Die Probleme, die heute bestehen, genügen.«
Einige Faktoren k önnen die obige Bewertung null und nichtig machen. Wenn
die Kosten daf ür, die Änderung morgen durchzuf ühren, sehr viel h öher sind,
dann sollten wir die Entscheidung heute in der Hoffnung treffen, auch die rich-
tige Entscheidung getroffen zu haben. Wenn das System eine gen ügend geringe
Trägheit hat (z.B. wenn wirklich intelligente Leute im Team sind), dann hat das
--- PAGE 131 ---
 Rolle der Bilder im Design 111
Just-in-Time-Design weniger Vorz üge. Wenn man wirklich ausgezeichnet raten
kann, dann sollte man das gesamte System heute entwerfen. In allen anderen
Fällen sehe ich jedoch keine Alternative zu der Schlussfolgerung, dass man heute
an dem Design für heute und morgen an dem Design für morgen arbeiten soll.
Rolle der Bilder im Design
Und was ist mit den h übschen Bildern von Design und Analyse? Manche Leute
können ihr Design besser in Form von Bildern als in Code ausdrücken. Was kann
eine visuell ausgerichtete Person zum Design beitragen?
Erstens ist es ganz in Ordnung, das Softwaredesign mithilfe expliziter Bilder statt
rein mentaler oder textueller Modelle des Systems zu entwerfen, und zum ande-
ren spricht viel f ür einen grafischen Ansatz. Schwierigkeiten beim Zeichnen der
Bilder k önnen Hinweise darauf geben, wie ausgereift ein Design ist. Falls es
unmöglich ist, die Anzahl der Elemente auf ein verwaltbares Ma ß zu reduzieren,
falls es eine offensichtliche Asymmetrie gibt, falls es viel mehr Linien als K ästen
gibt, dann sind dies alles Hinweise auf ein schlechtes Design, die aus der grafi-
schen Darstellung des Designs hervorgehen.
Eine weitere Stärke des Designs mithilfe von Bildern ist seine Geschwindigkeit. In
der Zeit, die man dazu brauchen w ürde, ein Design zu kodieren, kann man drei
Designs mithilfe von Bildern vergleichen und einander gegenüberstellen.
Problematisch an Bildern ist jedoch, dass sie kein konkretes Feedback geben. Sie
geben bestimmte Arten von Feedback über das Design, aber sie isolieren einen
von den anderen. Leider sind die Feedbacks, von denen Bilder uns isolieren,
genau die diejenigen, von denen man am meisten lernt. Wird dieser Testfall lau-
fen? F ördert dieses Design einfachen Code? Dies sind Feedbacks, die man nur
durch das Programmieren erhalten kann.
Einerseits kann man schnell arbeiten, wenn man Bilder verwendet, und anderer-
seits geht man damit ein Risiko ein. Wir brauchen eine Strategie, die uns die Stär-
ken des grafischen Ansatzes nutzbar macht und gleichzeitig dessen Schw ächen
verringert.
Wir stehen aber nicht allein da. Wir haben die Prinzipien, die uns f ühren kön-
nen. Sehen wir uns das einmal an.
 Kleine Anfangsinvestition – legt nahe, dass wir nur wenige Bilder auf einmal
zeichnen.
 Spielen, um zu gewinnen – legt nahe, dass wir Bilder nicht aus Angst verwenden
(z.B. weil wir den Moment hinausz ögern wollen, an dem wir zugeben m üs-
sen, dass wir nicht wissen, wie das Design aussehen soll).
--- PAGE 132 ---
112 17 Designstrategie
 Unmittelbares Feedback – legt nahe, dass wir rasch herausfinden, ob unsere Bil-
der zutreffend sind oder nicht.
 Die Instinkte der Mitarbeiter nutzen, nicht dagegen arbeiten  – legt nahe, dass wir
diejenigen, die am besten mit Bildern arbeiten, dazu ermuntern, Bilder zu lie-
fern.
 Veränderungen wollen und mit leichtem Gep äck reisen – legt nahe, dass wir die
Bilder nicht aufheben, nachdem sie sich im Code niedergeschlagen haben, da
die Entscheidungen, die diese Bilder repräsentieren, sich morgen wahrschein-
lich sowieso ändern werden.
Die XP-Strategie besteht darin, dass jeder nach Herzenslust mit Bildern ein
Design entwerfen kann, aber sobald sich eine Frage ergibt, die sich nur durch
Code beantworten l ässt, müssen die Designer sich dem Programmieren zuwen-
den, um diese Frage zu beantworten. Die Bilder werden nicht aufgehoben. Bei-
spielsweise könnten die Bilder auf eine Tafel gezeichnet werden. Wenn man sich
wünscht, man k önnte die Tafel aufheben, dann ist das ein sicheres Anzeichen
dafür, dass das Design entweder dem Team oder dem System gegen über nicht
richtig vermittelt wurde.
Falls es Quellcode gibt, der sich am besten in Bildern ausdr ücken l ässt, dann
sollte man ihn auch in Bildern ausdrücken, bearbeiten und pflegen. CASE-Tools,
die Ihnen die M öglichkeit geben, das gesamte Verhalten eines Systems festzule-
gen, sind in Ordnung. Man mag das, was diese Tools leisten, »Codegenerierung«
nennen, aber f ür mich sieht es ganz nach einer Programmiersprache aus. Ich
habe nichts gegen Bilder einzuwenden, sondern dagegen, dass man versucht,
mehrere Formen derselben Information auf dem gleichen Stand zu halten.
Wenn Sie eine textuelle Programmiersprache einsetzen und diesen Rat befolgen,
dann werden Sie nie mehr als 10 bis 15 Minuten f ür das Zeichnen von Bildern
aufwenden. Dann wissen Sie, welche Fragen Sie dem System stellen m üssen.
Nachdem Sie die Antwort erhalten haben, zeichnen Sie einige weitere Bilder, bis
Sie wieder auf eine Frage stoßen, die eine konkrete Antwort erfordert.
Derselbe Rat gilt für andere Designnotationen wie CRC-Karten, die nicht mit Pro-
grammcode arbeiten. Verwenden Sie sie einige Minuten lang, bis Sie eine Frage
herausgearbeitet haben, dann wenden Sie sich dem System zu, um das Risiko
gering zu halten, dass Sie sich etwas vorgemacht haben.
--- PAGE 133 ---
 Systemarchitektur 113
Systemarchitektur
Ich habe im obigen Abschnitt nicht den Begriff der Architektur gebraucht. Die
Architektur ist in XP-Projekten genauso wichtig wie in jedem anderen Software-
projekt. Ein Teil der Architektur wird durch die Metapher ausgedr ückt. Wenn
man eine gute Metapher gefunden hat, dann kann jeder im Team sagen, wie das
System als Ganzes funktioniert.
Der n ächste Schritt besteht darin, herauszufinden, wie sich die Storycard in
Objekte verwandeln l ässt. Die Regeln des Planungsspiels besagen, dass es sich
beim Ergebnis der ersten Iteration um ein funktionierendes Grundger üst des
gesamten Systems handeln muss. Aber dann muss man immer noch das ein-
fachste funktionierende Grundger üst entwerfen. Wie kann man diese beiden
Anforderungen miteinander vereinen?
Für die erste Iteration wählt man eine Reihe einfacher, grundlegender Leistungs-
merkmale (Storycards) aus, von denen man erwartet, dass sie dazu zwingen, die
gesamte Architektur zu erstellen. Dann verengt man seinen Horizont und imple-
mentiert diese Leistungsmerkmale auf die einfachste funktionierende Weise. Am
Ende dieser Übung hat man die Architektur. Es mag nicht die Architektur sein,
die man erwartet hat, aber auf jeden Fall hat man dann etwas gelernt.
Was passiert, wenn man nicht die Menge von Leistungsmerkmalen findet, die
dazu zwingt, jene Architektur zu entwerfen, von der man absolut sicher wei ß,
dass man sie braucht? Dann kann man die gesamte Architektur anhand von Spe-
kulationen implementieren oder man erstellt gerade so viel von der Architektur,
wie zur Erf üllung der aktuellen Anforderungen n ötig ist, und vertraut darauf,
dass man die Architektur später ergänzen kann. Ich implementiere die Architek-
tur, die ich im Moment ben ötige, und vertraue auf meine F ähigkeit, sie sp äter
ändern zu können.
--- PAGE 135 ---
18 Teststrategie
Wir werden Minute für Minute testen, bevor wir programmieren. Wir werden diese Tests
ewig lange aufheben und sie alle zusammen immer wieder ausführen. Wir werden
zudem Tests aus der Perspektive des Kunden schreiben.
Oh je! Niemand möchte über das Testen reden. Testen ist das hässliche Stiefkind
der Softwareentwicklung. Das Problem ist nur, dass jeder weiß, wie wichtig das
Testen ist. Jeder weiß, dass man nicht genug testen kann. Und wir spüren es –
unsere Projekte verlaufen nicht so reibungslos, wie sie sollten, und wir haben den
Eindruck, durch vermehrtes Testen könnte man dem Problem beikommen. Aber
dann lesen wir ein Buch zum Thema Testen und verzetteln uns sofort in den vie-
len Arten und Methoden des Testens. Es ist völlig unmöglich, all das zu tun und
in der Entwicklung weiterzukommen.
Folgendermaßen sieht das Testen in XP aus. Wenn ein Programmierer Code
schreibt, dann geht er immer davon aus, dass er funktioniert. Jedes Mal also,
wenn der Programmierer denkt, sein Code wird funktionieren, dann nimmt er
dieses Vertrauen aus dem Nichts und verwandelt es in etwas, das in das Pro-
gramm einfließt. Das Vertrauen ist für seine eigenen Zwecke da. Und da es in das
Programm eingeflossen ist, können auch alle anderen es nutzen.
Dasselbe gilt für den Kunden. Jedes Mal, wenn dem Kunden etwas Konkretes ein-
fällt, was das Programm leisten sollte, dann verwandelt er es in ein Stück Ver-
trauen, das in das Programm eingeht. Jetzt befinden sich dort das Vertrauen des
Kunden und das Vertrauen des Programmierers. Das Programm erhält einfach
immer mehr Vertrauen.
Jetzt sieht sich ein Tester das Testverfahren in XP an und schmunzelt. Dies ist
nicht das Werk von jemandem, der gerne testet. Ganz im Gegenteil. Es ist das
Werk von jemandem, der gerne Programme zum Laufen bringt. Man sollte daher
die Tests schreiben, die dazu beitragen, Programme zum Laufen zu bringen und
am Laufen zu erhalten. Nicht mehr.
Erinnern Sie sich an das Prinzip »Instinkte nutzen, nicht dagegen arbeiten«? Das
ist der Grundfehler in den Büchern zum Thema Testen, die ich gelesen habe. Sie
beginnen mit der Prämisse, dass Testen im Mittelpunkt der Entwicklung steht.
Man muss diesen Test durchführen und jenen Test und dann noch diesen da.
Wenn wir wollen, dass Programmierer und Kunden Tests schreiben, dann gestal-
ten wir den Vorgang besser so einfach wie möglich, wobei wir davon ausgehen,
dass die Tests ein Instrumentarium bilden und das Verhalten des Systems, das
--- PAGE 136 ---
116 18 Teststrategie
mit diesen Instrumenten bearbeitet wird, jedem am Herzen liegt und nicht die
Tests an sich. W äre es m öglich, ohne Tests zu entwickeln, dann w ürden wir
sofort alle Tests über Bord werfen.
Massimo Arnoldini schreibt:
Leider gilt wenigstens für mich (und nicht nur für mich), dass das Testen der menschli-
chen Natur widerspricht. Wenn Sie auf Ihren inneren Schweinehund h ören, dann wer-
den Sie bald ohne Tests programmieren. Nach einer Weile, wenn Ihre rationale Seite die
Oberhand gewinnt, halten Sie inne und beginnen, Tests zu schreiben. Sie haben zudem
erwähnt, dass das Programmieren in Paaren die Wahrscheinlichkeit verringert, dass
beide Partner gleichzeitig auf ihren inneren Schweinehund hören. (Quelle: E-Mail)
Die Tests, die man in XP schreibt, sind isoliert und automatisiert.
Erstens interagiert nicht jeder Test mit den anderen Tests, die man schreibt. Auf
diese Weise wird das Problem vermieden, dass ein Test fehlschl ägt und hundert
andere Fehler nach sich zieht. Nichts entmutigt mehr beim Testen als falsche
Fehlermeldungen. Man bekommt diesen Adrenalinstoß, wenn man morgens ins
Büro kommt und einen Stapel von Fehlermeldungen vorfindet. Wenn sich dann
herausstellt, dass es gar nicht so schlimm ist, dann ist das eine gro ße Entt äu-
schung. Wird man den Tests weiterhin die n ötige Beachtung schenken, wenn
sich das Ganze danach noch fünf oder sechs Mal wiederholt? Sicher nicht.
Die Test sind also automatisiert. Tests sind wertvoller, wenn das Team überarbei-
tet ist und das menschliche Urteilsverm ögen aussetzt. Daher m üssen die Tests
automatisiert sein und nicht mehr als eine positive oder negative Anzeige liefern,
ob sich das System wie erwartet verhält.
Es ist unm öglich, absolut alles zu testen, wenn die Tests nicht genauso kompli-
ziert und fehleranfällig wie der Code werden sollen. Es ist Selbstmord, nichts zu
testen (im Sinne isolierter automatisierter Tests). Was soll man also von all dem
testen, was man theoretisch testen könnte?
Man sollte all das testen, in das sich Fehler einschleichen k önnen. Wenn der
Code so einfach ist, dass er unm öglich Fehler beinhalten kann, und man festge-
stellt hat, dass dieser Code in der Praxis tats ächlich fehlerfrei l äuft, dann sollte
man keinen Test daf ür schreiben. Wenn ich Ihnen sagen w ürde, Sie m üssten
absolut alles testen, dann würden Sie bald feststellen, dass ein Großteil der Tests,
die Sie schreiben, wertlos sind, und wenn Sie mir ein wenig ähnlich sind, dann
würden Sie aufhören, diese Tests zu schreiben. »Diese Herumtesterei ist für nichts
und wieder nichts.«
--- PAGE 137 ---
 Wer schreibt Tests? 117
Testen ist eine Wette. Die Wette zahlt sich aus, wenn Ihre Erwartungen nicht
erfüllt werden. Testen kann sich z.B. lohnen, wenn ein Test fehlerfrei l äuft, von
dem Sie dies nicht erwartet h ätten. Sie finden dann besser heraus, warum er
läuft, da der Code intelligenter ist, als Sie es sind. Das Testen zahlt sich auch
dann aus, wenn ein Test nicht l äuft, von dem Sie erwartet haben, dass er fehler-
frei ausgeführt wird. In beiden Fällen lernen Sie etwas. Und Softwareentwicklung
ist Lernen. Je mehr Sie lernen, desto besser entwickeln Sie.
Wenn man könnte, würde man also nur die Tests schreiben, die sich auszahlen.
Da man nicht wissen kann, welche Tests sich lohnen (wenn man es wüsste, dann
könnte man nichts mehr lernen), schreibt man Tests, die sich lohnen k önnten.
Während man testet, denkt man dar über nach, welche Art von Tests sich auszu-
zahlen scheinen und welche nicht, und man schreibt mehr Tests von der Sorte,
die sich auszahlen, und weniger von der Sorte, die sich nicht auszahlen.
Wer schreibt Tests?
Wie ich am Beginn dieses Kapitels ausf ührte, kommen die Tests von zwei Quel-
len:
 Programmierer
 Kunden
Die Programmierer schreiben Tests f ür einzelne Methoden. Sie schreiben einen
Test unter den folgenden Bedingungen:
 Wenn die Schnittstelle für eine Methode völlig unklar ist, schreibt man einen
Test, bevor man die Methode schreibt.
 Wenn die Schnittstelle klar ist, aber man den Eindruck hat, die Implementie-
rung könnte etwas kompliziert werden, dann schreibt man einen Test, bevor
man die Methode schreibt.
 Wenn man sich ungew öhnliche Umstände vorstellen kann, unter denen der
Code wie geschrieben funktionieren soll, dann schreibt man einen Test, um
diese Umstände darzustellen.
 Wenn man sp äter ein Problem entdeckt, schreibt man einen Test, um das
Problem zu isolieren.
 Wenn man vorhat, Code zu überarbeiten, und nicht ganz sicher ist, wie sich
der Code verhalten sollte, und es keinen Test f ür das betreffende Verhalten
gibt, dann schreibt man zuerst einen Test.
--- PAGE 138 ---
118 18 Teststrategie
Die von den Programmierern geschriebenen Komponententests m üssen stets
100% fehlerfrei laufen. Wenn ein Komponententest scheitert, dann gibt es im
Team keine wichtigere Aufgabe, als diese Tests zum Laufen zu bringen. Der
Grund dafür ist, dass man f ür die Korrektur des Codes eine unbekannte Menge
an Arbeit aufwenden muss, wenn ein Test gescheitert ist. Die Korrektur ist mögli-
cherweise in einer Minute erledigt. Es kann aber auch einen Monat dauern. Man
weiß es einfach nicht. Und weil die Programmierer die Erstellung und Ausf üh-
rung der Komponententests kontrollieren, k önnen sie die Tests stets mit dem
Quellcode synchronisieren und auf dem aktuellsten Stand halten.
Die Kunden schreiben Tests f ür einzelne Leistungsmerkmale (Storycards). Sie
müssen sich folgende Frage stellen: »Was muss überprüft werden, bevor ich
sicher sein kann, dass dieses Leistungsmerkmal implementiert wurde?« Jedes Sze-
nario, das ihnen einfällt, wird zu einem Test, in diesem Fall einem Funktionstest.
Die Funktionstests werden nicht unbedingt stets zu 100% fehlerfrei ausgef ührt.
Diese Tests stammen aus einer anderen Quelle und ich habe bislang noch kein
Verfahren gefunden, mit dem sich diese Tests auf dieselbe Weise mit dem Code
synchronisieren lassen wie die Komponententests. W ährend das Ma ß der Kom-
ponententests binär ist (100% oder Scheitern), basiert das Ma ß der Funktions-
tests notwendigerweise auf Prozentanteilen. Mit der Zeit kann man erwarten,
dass die Funktionstests eine Quote von nahezu 100% erreichen. Wenn der Frei-
gabetermin naht, muss der Kunde die scheiternden Funktionstests kategorisie-
ren. Einige sind wichtiger und müssen eher korrigiert werden als andere.
Die Kunden können die Funktionstests normalerweise nicht selbst programmie-
ren. Ihnen muss von jemandem geholfen werden, der ihre Testangaben zuerst in
Tests übersetzen und mit der Zeit Tools erstellen kann, mit denen die Kunden
ihre eigenen Tests schreiben, ausführen und pflegen können. Aus diesem Grund
umfasst ein XP-Team beliebiger Größe mindestens einen Tester. Aufgabe des Tes-
ters ist es, die etwas vagen Testideen der Kunden in reale, automatisierte und iso-
lierte Tests zu übersetzen. Der Tester verwendet auch die vom Kunden angereg-
ten Tests als Ausgangspunkt f ür Variationen, die m öglicherweise M ängel der
Software aufdecken können.
Auch wenn man einen eigens daf ür eingestellten Tester hat, jemanden, dem es
Spaß macht, die Mängel einer Software aufzudecken, die angeblich gut program-
miert ist, dann arbeitet dieser Tester doch innerhalb desselben ökonomischen
Rahmens wie die Programmierer, die die Tests schreiben. Der Tester schließt Wet-
ten auf die Tests ab und hofft, dass ein Test erfolgreich ausgef ührt wird, wenn er
scheitern sollte, oder dass der Test scheitert, wenn er funktionieren sollte. Der
--- PAGE 139 ---
 Weitere Tests 119
Tester lernt daher mit der Zeit, immer bessere Tests zu schreiben, Tests, die sich
mit höherer Wahrscheinlichkeit auszahlen. Der Tester ist sicherlich nicht dazu
da, einfach möglichst viele Tests zu produzieren.
Weitere Tests
Auch wenn Komponenten- und Funktionstests das Kernst ück der XP-Teststrate-
gie bilden, gibt es andere Tests, die von Zeit zu Zeit sinnvoll sind. Das XP-Team
erkennt, wenn es in die Irre geht und eine andere Art von Test helfen k önnte.
Das Team kann dann folgende Arten von Tests schreiben (oder jede andere Art
von Test, die in einem Buch zum Thema Testen beschrieben wird):
 Paralleltest – Ein Test, der beweisen soll, dass das neue System genau wie das
alte funktioniert. Eigentlich zeigt der Test, wie sich das neue System vom
alten System unterscheidet, sodass die Gesch äftsseite eine gesch äftliche Ent-
scheidung darüber treffen kann, ob der Unterschied gering genug ist, um das
neue System in Betrieb zu nehmen.
 Belastungstest – Ein Test, der die höchste Belastung simulieren soll. Belastungs-
tests sind sinnvoll bei komplexen Systemen, deren Leistungsverhalten nur
schwer vorherzusehen ist.
 Idiotentest – Ein Test, der sicherstellen soll, dass das System auf unvern ünftige
Eingaben vernünftig reagiert.
--- PAGE 141 ---
Teil 3
XP implementieren
In diesem Teil werden wir die Strategien des letzten Abschnitts in die Praxis über-
tragen. Sobald man eine radikal vereinfachte Menge an Strategien gewählt hat,
verfügt man plötzlich über sehr viel mehr Handlungsspielraum. Sie können diese
Flexibilität zu verschiedenen Zwecken nutzen, müssen sich jedoch darüber im
Klaren sein, dass sie überhaupt besteht und welche Möglichkeiten sich dadurch
für Sie eröffnen.
--- PAGE 143 ---
19 XP übernehmen
Führen Sie die einzelnen Verfahren nacheinander ein, wenn Sie XP übernehmen, und
gehen Sie damit jeweils auf das dringlichste Problem des Teams ein. Lösen Sie so schritt-
weise ein Problem nach dem anderen.
Ich danke Don Wells für seine einfache, offensichtlich korrekte Antwort auf die
Frage, wie man XP übernimmt.
1. Man wählt das schlimmste Problem aus.
2. Man löst es unter Verwendung der XP-Konzepte.
3. Wenn es nicht mehr das schlimmste Problem ist, beginnt man wieder von
vorn.
Das Testen und das Planspiel bieten sich wohl am ehesten als Ausgangspunkte
an. Viele Projekte haben mit Qualitätsproblemen oder mit einer unausgewoge-
nen Machtverteilung zwischen Geschäftsseite und Entwicklung zu kämpfen. Das
zweite XP-Buch mit dem Titel Extreme Programming Applied: Playing to Win  (das
voraussichtlich im Winter 2000 erscheinen wird) wird auf diese beiden Themen
eingehen.
Dieser Ansatz hat viele Vorzüge. Er ist so einfach, dass sogar ich ihn verstehen
konnte (nachdem mir Don einen leichten Klaps auf den Hinterkopf gegeben
hatte). Da man nacheinander jeweils nur ein Verfahren lernt, kann man jedes
Verfahren gründlich erlernen. Weil man immer sein dringlichstes Problem
angeht, ist man sehr motiviert, Änderungen vorzunehmen, und die eigenen
Bemühungen werden durch positive Rückmeldungen sofort quittiert.
Damit wird auch der Einwand gegen XP außer Kraft gesetzt, es handle sich um
ein Allerwelts-Konzept. Während man sich die einzelnen Praktiken aneignet,
passt man sie gleichzeitig an die eigene Situation an. Falls man kein Problem hat,
dann fällt einem erst gar nicht ein, Probleme mit XP lösen zu wollen.
Unterschätzen Sie die Bedeutung der konkreten Umgebung bei der Übernahme
von XP nicht, auch wenn Sie sich gar nicht bewusst sein sollten, dass die Umge-
bung problematisch ist. Ich habe oft mit einem Schraubenzieher und einem
Inbusschlüssel angefangen. Ich füge zwei weitere Schritte dem Prozess hinzu.
–1. Stellen Sie die Möbel so um, dass man in Paaren programmieren kann
und der Kunde im Team mitarbeiten kann.
0. Kaufen Sie Knabberzeug.
--- PAGE 145 ---
20 XP anpassen
Projekte, die ihre bestehende Kultur ändern möchten, sind weit häufiger als Projekte, die
eine neue Kultur von Grund auf neu schaffen können. Übernehmen Sie XP in laufenden
Projekten schrittweise und starten Sie hierbei mit dem Testen oder Planen.
Es ist eine Herausforderung, wenn man mit einem neuen Team XP praktizieren
möchte. XP mit einem vorhandenen Team und einer vorhandenen Codebasis zu
übernehmen, ist noch schwieriger. Man muss alle vorhandenen Schwierigkeiten
bewältigen – die Fertigkeiten lernen, als Coach dienen, das Verfahren anpassen.
Man steht zudem unter dem unmittelbaren Druck, die Produktionssoftware am
Laufen zu halten. Die Software wurde wahrscheinlich nicht entsprechend der
neuen Standards geschrieben. Sie ist wahrscheinlich komplexer als sie sein
müsste. Sie wurde wahrscheinlich nicht in dem Maß getestet, wie Sie es sich
wünschten. Für ein neues Team können Sie nur solche Leute aussuchen, die
gewillt sind, XP auszuprobieren. Bei einem vorhandenen Team wird es wahr-
scheinlich einige Skeptiker geben. Und zudem sind die Schreibtische bereits auf-
gestellt und man kann daran nicht in Paaren programmieren.
Man muss sich mehr Zeit nehmen, wenn man XP an ein laufendes Projekt anpas-
sen will, als wenn man XP in einem entsprechendem neuen Team einsetzt. Das
ist die schlechte Nachricht. Die gute Nachricht ist jedoch, dass es bei einem XP-
Entwicklungsprojekt, das am »grünen Tisch« beginnt, einige Risiken gibt, mit
denen man sich in diesem Fall nicht beschäftigen muss. Man wird sich beispiels-
weise niemals in der riskanten Position befinden, zu denken, eine gute Idee für
ein Softwareprodukt zu haben, aber es nicht genau zu wissen. Man wird sich nie
in der riskanten Position befinden, eine Menge Entscheidungen ohne die soforti-
gen, schonungslosen Feedbacks, die man von Kunden erhält, fällen zu müssen.
Ich habe schon mit vielen Teams gesprochen, die gesagt haben: »Oh ja, wir set-
zen XP wirklich ein. Alles, außer dem Testzeug. Und wir haben ein 200 Seiten
dickes Anforderungsdokument. Aber alles andere ist genau so, wie wir es tun.«
Dies ist der Grund, warum dieses Kapitel nach den einzelnen Verfahren geglie-
dert ist. Wenn Sie bereits ein Verfahren vertreten, das von XP befürwortet wird,
dann können Sie den betreffenden Abschnitt übergehen. Wenn Sie auf ein neues
Verfahren stoßen, das Sie einsetzen möchten, dann lesen Sie den Abschnitt über
dieses Verfahren.
Wie kann man XP für ein vorhandenes Team und für Software, die sich bereits in
Produktion befindet, übernehmen? Sie müssen hierzu die Übernahmestrategie in
den folgenden Bereichen anpassen:
--- PAGE 146 ---
126 20 XP anpassen
 Testen
 Design
 Planung
 Management
 Entwicklung
Testen
Testen ist m öglicherweise der frustrierendste Bereich, wenn man vorhandenen
Code nach XP überträgt. Der Code, der geschrieben wurde, bevor man Tests
hatte, kann einem Angst einfl ößen. Man wei ß nie genau, wo man steht. Bringt
diese Änderung Gefahren mit sich? Man kann sich dessen nicht sicher sein.
Sobald man mit dem Schreiben von Tests beginnt, ändert sich das Bild. Man hat
dann Vertrauen in den neuen Code. Man scheut sich nicht davor, Änderungen
vorzunehmen. Es macht sogar irgendwie Spaß.
Alter und neuer Code unterscheiden sich wie Tag und Nacht. Sie werden feststel-
len, dass Sie den alten Code vermeiden. Dem muss man widerstehen. Die einzige
Möglichkeit, dieses Problem in den Griff zu bekommen, besteht darin, den
gesamten Code zu inspizieren. Ansonsten k önnen sich im Verborgenen
unschöne Dinge entwickeln und man hat es mit Risiken unbekannter Gr ößen-
ordnung zu tun.
In dieser Situation ist man versucht, einfach zur ückzugehen und die Tests f ür
den gesamten vorhandenen Code zu schreiben. Tun Sie das nicht. Schreiben Sie
stattdessen nach Bedarf Tests.
 Wenn die Funktionalit ät ungetesteten Codes erweitert werden muss, dann
schreiben Sie zuerst Tests für die vorhandene Funktionalität.
 Wenn Sie einen Fehler korrigieren m üssen, dann schreiben Sie zuerst einen
Test.
 Wenn Refactoring ansteht, dann schreiben Sie zuerst die Tests.
Sie werden feststellen, dass die Entwicklung anfangs langsam zu laufen scheint.
Sie werden mehr Zeit damit verbringen, Tests zu schreiben, als in gew öhnlichen
XP-Projekten und Sie werden den Eindruck haben, dass Sie beim Implementieren
neuer Funktionalität langsamer Fortschritte machen als zuvor. Allerdings werden
jene Teile des Systems, die Sie h äufig bearbeiten, jene Teile, die Aufmerksamkeit
--- PAGE 147 ---
 Design 127
und neue Funktionalität erfordern, rasch gründlich getestet sein. Bald werden die
Teile des Systems, die am häufigsten verwendet werden, so aussehen, als seien sie
mit XP programmiert.
Design
Der Übergang zum XP-Design ähnelt sehr dem Übergang zum XP-Testen. Sie
werden bald bemerken, dass der neue Code ein v öllig anderes Gefühl vermittelt
als der alte Code. Sie werden alles auf einmal anpassen wollen. Tun Sie das nicht.
Gehen Sie schrittweise vor. Wenn Sie neue Funktionalität hinzufügen, sollten Sie
immer darauf vorbereitet sein, zuerst das Design zu überarbeiten. In der XP-Ent-
wicklung ist man stets darauf vorbereitet, vor dem Implementieren Vorhandenes
zu überarbeiten, aber da Sie das System auf XP umstellen, müssen Sie es nun häu-
figer tun.
Am Beginn des Prozesses sollte das Team einige grobe Refactoring-Ziele festlegen.
Es mag vielleicht eine besonders verworrene Vererbungshierarchie geben oder
eine Funktion ist über das gesamte System verteilt, die Sie vereinheitlichen wol-
len. Legen Sie diese Ziele fest, notieren Sie sie auf Karten und hängen Sie die Kar-
ten gut sichtbar auf. Wenn das gro ße Refactoring erledigt ist (was Monate oder
sogar ein Jahr dauern kann), dann sollten Sie das feiern. Verbrennen Sie alle Kar-
ten. Begehen Sie das Fest bei ausreichend Speis und Trank.
Diese Strategie hat einen ähnlichen Effekt wie die bedarfsgesteuerte Teststrategie.
Diejenigen Teile des Systems, mit denen Sie in der Entwicklungsarbeit ständig zu
tun haben, werden bald das gleiche Gefühl vermitteln wie der Code, den Sie jetzt
schreiben. Der Zusatzaufwand zus ätzlichen Refactorings wird bald kleiner wer-
den.
Planung
Sie m üssen Ihre vorhandenen Anforderungsunterlagen auf Storycards übertra-
gen. Sie müssen Ihren Kunden über die neuen Spielregeln aufkl ären. Der Kunde
muss dann entscheiden, woraus die nächste Version bestehen soll.
Die größte Herausforderung (und Chance) der Umstellung auf die XP-Planung
besteht darin, den Kunden darin zu unterrichten, wie er vom Team sehr viel
mehr erhalten kann. Der Kunde hat wahrscheinlich noch keine Erfahrungen mit
einem Entwicklungsteam, das Änderungen an den Anforderungen begr üßt. Es
dauert eine Weile, bis man sich daran gew öhnt hat, wie viel mehr der Kunde
vom Team bekommen kann.
--- PAGE 148 ---
128 20 XP anpassen
Management
Eine der schwierigsten Umstellungen besteht darin, sich an das XP-Management
zu gewöhnen. Das XP-Management ist eine Sache des Umleitens und Einfluss-
nehmens. Wenn Sie Manager sind, dann werden Sie sich wahrscheinlich dabei
ertappen, Entscheidungen zu treffen, die eigentlich von den Programmierern
oder Kunden getroffen werden sollten. Sollte dies so sein, lassen Sie sich dadurch
nicht aus der Ruhe bringen. Erinnern Sie sich selbst und alle anderen Anwesen-
den einfach daran, dass Sie noch im Lernen begriffen sind. Dann bitten Sie die
richtige Person, die Entscheidung zu treffen und Ihnen das Ergebnis mitzuteilen.
Programmierer, die pl ötzlich vor neue Aufgaben gestellt werden, werden wahr-
scheinlich nicht sofort gute Arbeit leisten. Als Manager m üssen Sie während der
Umstellungsphase genau darauf achten, jeden an die Regeln zu erinnern, die das
Team gewählt hat. Unter Druck kehrt jeder zu alten Verhaltensmustern zur ück,
gleichgültig, ob sich diese Muster bewährt hatten oder nicht.
Man wird sich ähnlich fühlen wie bei der Umstellung des Designs oder der Tests.
Zuerst hat man ein komisches Gef ühl. Man weiß, dass man nicht optimal arbei-
tet. Wenn man auf die Situationen achtet, die sich täglich ergeben, dann werden
Sie (und die Programmierer und Kunden) lernen, damit ohne Schwierigkeiten
umzugehen. Sie werden sich aber bald an den neuen Prozess gewöhnen und sich
damit wohl fühlen. Von Zeit zu Zeit wird sich jedoch eine Situation ergeben, die
Sie noch nicht im »XP-Stil« gehandhabt haben. Wenn das passiert, halten Sie
einen Moment inne. Erinnern Sie das Team an die Regeln, Werte und Prinzipien.
Dann entscheiden Sie, was zu tun ist.
Einer der schwierigsten Aspekte daran, Manager eines fliegenden Wechsels zu XP
zu sein, betrifft die Frage, ob ein Teammitglied nicht die Erwartungen erfüllt. Oft
ist es sinnvoller, sich zu trennen. Sie sollten diese Änderung vollziehen, sobald
Sie sich sicher sind, dass sich die Situation nicht bessert.
Entwicklung
Zuallererst müssen Sie die Schreibtische richtig anordnen. Das ist ernst gemeint.
Lesen Sie erneut das Kapitel zum Programmieren in Paaren (Kapitel 16, »Entwick-
lungsstrategie«). Stellen Sie die Schreibtische so auf, dass zwei Personen nebenei-
nander daran sitzen und die Tastatur einander weitergeben und bedienen k ön-
nen, ohne ihre Stühle verrücken zu müssen.
Einerseits sollten Sie hinsichtlich des Programmierens in Paaren rigider sein,
wenn Sie auf XP umstellen, als Sie es normalerweise sein m üssten. Das Program-
mieren in Paaren kann anfangs unbequem sein. Zwingen Sie sich dazu, auch
--- PAGE 149 ---
 In Schwierigkeiten? 129
wenn Sie keine Lust haben. Andererseits sollten Sie gelegentlich eine Pause einle-
gen. Ziehen Sie sich zurück und programmieren Sie einige Stunden allein. Natür-
lich sollten Sie die Ergebnisse wegwerfen, aber verderben Sie sich nicht die
Freude am Programmieren, nur um sagen zu k önnen, Sie haben in einer Woche
30 Stunden mit einem Partner programmiert.
Lösen Sie Schritt für Schritt die Test- und Designprobleme. Aktualisieren Sie den
Code, den Sie bearbeiten, damit er den Programmierstandards entspricht, auf die
sich das Team geeinigt hat. Sie werden überrascht sein, wie viel Sie aus dieser ein-
fachen Tätigkeit lernen können.
In Schwierigkeiten?
Einige von Ihnen, die dies hier lesen, haben vielleicht ein Team, aber die Soft-
ware ist noch nicht in Produktion. Ihr Projekt steckt m öglicherweise in einer
Menge Schwierigkeiten. XP mag da wie ein Rettungsanker erscheinen.
Verlassen Sie sich nicht darauf. H ätten Sie von Anfang an XP eingesetzt, dann
hätten Sie damit m öglicherweise die aktuelle Situation vermieden (oder auch
nicht). Wenn es schon schwierig ist, bei vollem Galopp die Pferde zu wechseln,
dann ist dies zehnmal so schwer, wenn man auf einem verletzten Pferd sitzt. Die
Situation ist spannungsgeladen. Die Moral ist auf einem Tiefpunkt.
Wenn Sie die Wahl haben, auf XP umzustellen oder gek ündigt zu werden, dann
sollten Sie sich zunächst vor Augen halten, dass Ihre Chancen, sich unter diesen
Bedingungen ständig neue Verfahren aneignen zu k önnen, nicht sehr gut ste-
hen. Unter Stress kehrt man wieder zu alten Verhaltensweisen zur ück. Sie haben
bereits eine Menge Stress. Sie haben viel geringere Chancen, die Umstellung
erfolgreich zu bewältigen. Legen Sie f ür sich ein bescheideneres Ziel fest, als das
gesamte Projekt retten zu wollen. Lassen Sie die Dinge auf sich zukommen und
gehen Sie sie langsam an. Freuen Sie sich dar über, wie viel Sie über das Testen
oder das indirekte Management lernen k önnen oder welch sch önes Design Sie
entwerfen können oder wie viel Code Sie wegwerfen können. Vielleicht lässt sich
so viel Ordnung in das Chaos bringen, dass es Ihnen nichts ausmacht, morgen
wieder zur Arbeit zu kommen.
Wenn Sie ein in Schwierigkeiten geratenes Projekt auf XP umstellen, sollten Sie
das auf jeden Fall mit einer großen Geste machen. Halbheiten bewirken nur, dass
jeder den Eindruck gewinnt, sich in etwa dem gleichen Zustand wie zuvor zu
befinden. Bewerten Sie die aktuelle Codebasis sorgf ältig. Wären Sie ohne diesen
Code besser dran? Falls dem so ist, werfen Sie ihn weg – und zwar vollst ändig.
Halten Sie eine große Sonnwendfeier ab und verbrennen Sie die Bänder. Nehmen
Sie eine Woche frei. Fangen Sie mit frischem Mut wieder neu an.
--- PAGE 151 ---
21 Lebenszyklus eines idealen XP-Projekts
Das ideale XP-Projekt durchläuft eine kurze anfängliche Entwicklungsphase, der Jahre
folgen, in denen man gleichzeitig die Produktion unterstützt und Verbesserungen
anbringt, und schließlich wird das Projekt würdig in den Ruhestand versetzt, wenn es
nicht mehr sinnvoll ist.
Dieses Kapitel vermittelt Ihnen einen Eindruck vom Gesamtverlauf eines XP-Pro-
jekts. Es handelt sich dabei um eine idealisierte Darstellung – Sie sollten mittler-
weile wissen, dass kein XP-Projekt einem anderen genau gleichen kann (oder
soll). Ich hoffe, dieses Kapitel vermittelt Ihnen einen Eindruck davon, wie der
ideale allgemeine Ablauf eines XP-Projekts aussieht.
Erforschung
Die Vorproduktionsphase ist ein unnatürlicher Zustand für ein System und sollte
so rasch wie möglich überwunden werden. Welchen Spruch habe ich kürzlich
gehört? »In Produktion gehen oder sterben.« XP sagt genau das Gegenteil. Nicht
in Produktion zu sein bedeutet, Geld auszugeben, ohne Geld zu verdienen. Nun,
es mag zwar nur meine Geldbörse sein, aber ich finde diesen Zustand der Ausga-
ben ohne Einnahmen sehr unangenehm.
Bevor man in Produktion gehen kann, muss man jedoch daran glauben, dass
man in Produktion gehen kann. Sie müssen genug Vertrauen in Ihre Tools
haben, sodass Sie glauben, das Programm fertig stellen zu können. Sie müssen
glauben, dass Sie den Code, nachdem er fertig gestellt ist, tagein, tagaus ausfüh-
ren können. Sie müssen glauben, dass Sie die Fähigkeiten haben (oder erlernen
können), die Sie brauchen. Die Teammitglieder müssen lernen, sich gegenseitig
zu vertrauen.
In der Erforschungsphase stellt sich dies alles ein. Man ist mit dem Erforschen
fertig, wenn der Kunde davon überzeugt ist, dass die Storycards mehr als genug
Material für eine gute erste Version enthalten, und die Programmierer davon
überzeugt sind, dass sie keine bessere Aufwandsschätzung mehr liefern können,
ohne das System tatsächlich zu implementieren.
Während des Erforschens setzen die Programmierer jede Technologie ein, die sie
im Produktionssystem verwenden werden. Sie erkunden aktiv die Möglichkeiten
für die Systemarchitektur. Das tun Sie, indem sie ein oder zwei Wochen darauf
verwenden, ein System zu erstellen, das dem zu entwickelnden System ähnelt,
aber dazu drei oder vier verschiedene Alternativen ausprobieren. Verschiedene
--- PAGE 152 ---
132 21 Lebenszyklus eines idealen XP-Projekts
Paare können das System auf unterschiedliche Weise entwickeln und die Ergeb-
nisse dann vergleichen oder man kann zwei Paare damit beauftragen, das System
auf die gleiche Weise zu entwickeln, und dann sehen, welche Unterschiede sich
ergeben.
Falls eine Woche nicht ausreicht, eine bestimmte technologische Komponente
zum Laufen zu bringen, dann w ürde ich diese Technologie als Risiko einstufen.
Das heißt nicht, dass Sie diese Technologie nicht verwenden sollen. Sie sollten
sie jedoch eingehender erkunden und Alternativen in Betracht ziehen.
Sie sollten erwägen, während der Erforschungsphase einen Technologiespezialis-
ten in das Team zu holen, damit Ihre Versuche nicht durch irgendwelche Klei-
nigkeiten gehemmt werden, die von jemanden, der mit der Technologie vertraut
ist, mühelos gehandhabt werden können. Hüten Sie sich jedoch davor, jeden Rat
hinsichtlich eines m öglichen Einsatzes der Technologie blind anzunehmen.
Experten verfolgen gelegentlich Strategien, die nicht mit XP in Einklang stehen.
Das Team muss mit den Verfahren einverstanden sein, die von den Experten
gewählt werden. Die Aussage: »Der Experte hat das gesagt« ist nicht sehr befriedi-
gend, wenn ein Projekt außer Kontrolle gerät.
Die Programmierer sollten zudem die Leistungsgrenzen der Technologie auslo-
ten, die sie verwenden werden. Wenn irgend m öglich, sollten sie realistische
Belastungen mit der Produktionshardware und dem Netzwerk simulieren. Man
muss nicht das gesamte System fertig gestellt haben, um eine Simulation ausfüh-
ren zu k önnen. Man kann eine Menge Erfahrungen sammeln, wenn man bei-
spielsweise einfach berechnet, wie viele Bytes pro Sekunde das Netzwerk übertra-
gen k önnen muss, und dann ein Experiment durchf ührt, um festzustellen, ob
man die erforderliche Bandbreite zur Verfügung stellen kann.
Die Programmierer sollten auch mit Architekturvorschl ägen experimentieren –
wie erstellt man ein System, das Befehle über mehrere Ebenen hinweg r ückgän-
gig machen kann? Implementieren Sie einen Tag lang auf drei verschiedene Wei-
sen und sehen Sie sich dann an, welches Ergebnis den besten Eindruck macht.
Diese kleinen architektonischen Erkundungen sind besonders wichtig, wenn der
Benutzer mit Leistungsmerkmalen aufwartet, von deren Implementierung Sie
keine Ahnung haben.
Die Programmierer sollten jede Programmieraufgabe einsch ätzen, die sie w äh-
rend der Erforschungsphase in Angriff nehmen. Wenn eine Aufgabe erledigt ist,
sollten sie berichten, wie viel Zeit sie tats ächlich f ür diese Aufgabe ben ötigt
haben. Übung in der Aufwandskalkulation st ärkt das Vertrauen des Teams in
seine Schätzungen, wenn es an der Zeit ist, eine Verpflichtung einzugehen.
--- PAGE 153 ---
 Planung 133
Während das Team sich im Einsatz der Technologie übt, übt der Kunde das
Schreiben von Storycards f ür Leistungsmerkmale. Erwarten Sie nicht, dass dies
völlig reibungslos vonstatten geht. Die Storycards werden anfangs Ihren Erfor-
dernissen nicht genügen. Wichtig ist hier, dem Kunden ein rasches Feedback zu
den ersten Storycards zu geben, damit er lernt, das anzugeben, was die Program-
mierer brauchen, und keine unn ötigen Dinge angibt. Die Schl üsselfrage lautet:
»Können die Programmierer den Aufwand vern ünftig einsch ätzen, der f ür das
Leistungsmerkmal erforderlich ist? « Manchmal muss die Storycard (das Leis-
tungsmerkmal) anders formuliert werden, manchmal müssen die Programmierer
einfach loslegen und eine Weile experimentieren.
Wenn man ein Team hat, das seine Technologie und sich gut kennt, dann kann
die Erforschungsphase kurz sein und muss nur wenige Wochen dauern. Bei
einem Team, das mit der Technologie oder dem Bereich überhaupt nicht vertraut
ist, muss man m öglicherweise einige Monate f ür das Erforschen aufwenden.
Wenn die Erforschungsphase l änger dauern sollte, w ürde ich mich nach einem
kleinen, aber realen Projekt umsehen, das sich rasch fertig stellen l ässt, um die
Dringlichkeit des Prozesses zu verdeutlichen.
Planung
Zweck der Planungsphase ist es, dass sich die Kunden und Programmierer auf
einen realistischen Termin einigen, an dem die kleinste, wertvollste Menge an
Leistungsmerkmalen fertig gestellt sein soll. Der Abschnitt »Das Planungsspiel«
in Kapitel 15 erl äutert, wie man hierzu vorgeht. Wenn man w ährend der Erfor-
schungsphase Vorbereitungen trifft, dann sollte die Planung (die Erstellung eines
verpflichtenden Terminplans) ein oder zwei Tage dauern.
Der Plan für die erste Version sollte zwei bis sechs Monate umfassen. Innerhalb
eines k ürzeren Zeitraums kann man keine signifikanten Gesch äftsprobleme
lösen. (Wenn Sie es k önnen, ist das gro ßartig! In Tom Gilbs Buch Principles of
Software Engineering finden Sie Anregungen dazu, wie man die erste Version k ür-
zen kann.) Einen l ängeren Zeitraum für die Planungsphase zu veranschlagen ist
riskant.
Iterationen bis zur ersten Version
Der verpflichtende Terminplan wird in ein- bis vierw öchige Iterationen unter-
teilt. Jede Iteration ergibt eine Reihe von funktionalen Testf ällen für jedes Leis-
tungsmerkmal, das für diese Iteration geplant ist.
--- PAGE 154 ---
134 21 Lebenszyklus eines idealen XP-Projekts
Mit der ersten Iteration wird die Architektur erstellt. Wählen Sie für die erste Ite-
ration Storycards aus, die Sie dazu zwingen, »das gesamte System « zu erstellen,
wenn auch lediglich als Grundgerüst.
Die Auswahl der Storycards f ür die nachfolgenden Iterationen liegt ganz im
Ermessen des Kunden. Er muss sich folgende Frage stellen: »Welche Leistungs-
merkmale sollen in dieser Iteration bearbeitet werden?«
Während man die Iterationen durchl äuft, achtet man darauf, ob es Abweichun-
gen vom Plan gibt. Dauert alles doppelt so lange, wie man urspr ünglich ange-
nommen hat? Oder halb so lange? Werden die Testfälle pünktlich fertig gestellt?
Hat man Spaß an der Arbeit?
Wenn man Abweichungen vom Plan entdeckt, dann muss man etwas ändern.
Vielleicht muss der Plan ge ändert werden – fügen Sie Leistungsmerkmale hinzu
oder entfernen Sie welche oder ändern Sie deren Umfang. Vielleicht muss das
Verfahren geändert werden und Sie finden bessere Möglichkeiten, die Technolo-
gie zu nutzen oder XP anzuwenden.
Idealerweise sollte der Kunde am Ende jeder Iteration die Funktionstests fertig
gestellt haben und die Funktionstests sollten alle funktionieren. Feiern Sie das
Ende jeder Iteration – spendieren Sie Pizza, veranstalten Sie ein Feuerwerk, lassen
Sie den Kunden die erledigten Storycards signieren. Sie haben schlie ßlich gerade
pünktlich Qualitätssoftware geliefert. Vielleicht hat das Ganze nur drei Wochen
gedauert, aber das Team hat trotzdem etwas erreicht, und das ist es wert, gefeiert
zu werden.
Am Ende der letzten Iteration sind Sie bereit, in Produktion zu gehen.
In Produktion gehen
In der Endphase einer Version werden die Feedbackzyklen verkürzt. Statt dreiwö-
chiger Iterationen geht man vielleicht zu einw öchigen Iterationen über. Man
kann täglich ein kurzes Meeting abhalten, damit jeder wei ß, woran die anderen
arbeiten.
Normalerweise gibt es jemanden, der sein OK gibt, dass die Software in Produk-
tion gehen kann. Bereiten Sie sich darauf vor, neue Tests zu implementieren, die
beweisen, dass die Software produktionsreif ist. In dieser Phase werden h äufig
Paralleltests eingesetzt.
Sie m üssen in dieser Phase unter Umst änden auch das Leistungsverhalten des
Systems optimieren. Ich bin in diesem Buch kaum auf die Optimierung des Leis-
tungsverhaltens eingegangen. Ich glaube fest an das Motto: »Make it run, make it
--- PAGE 155 ---
 Wartung 135
right, make it fast.« Die Endphase ist der perfekte Zeitpunkt f ür Optimierungen,
da bis dahin viel Wissen in das Design des Systems eingeflossen ist, man dann
über die realistischsten Sch ätzungen zur Arbeitsbelastung des Systems verf ügt
und wahrscheinlich auch die Produktionshardware verfügbar ist.
Während dieser Phase wird man die Weiterentwicklung der Software langsamer
vorantreiben. Es ist nicht so, dass die Software nicht mehr weiterentwickelt wird,
sondern dass Risiken in der Bewertung, ob eine Änderung in die Version aufge-
nommen werden soll, mehr Gewicht erhalten. Sie m üssen sich jedoch bewusst
sein, dass Sie umso sicherer einsch ätzen können, wie das Design eines Systems
aussehen soll, je mehr Erfahrungen Sie mit einem System gesammelt haben.
Wenn Sie viele Ideen haben, die Sie nicht mit gutem Gewissen in diese Version
aufnehmen können, dann stellen Sie diese in einer Liste zusammen. Diese Liste
hängen Sie auf, damit jeder sehen kann, welche Richtung Sie einschlagen wer-
den, nachdem die Version in Produktion gegangen ist.
Geht die Software tats ächlich in Produktion, veranstalten Sie ein gro ßes Fest.
Viele Projekte gehen nie in Produktion. Dass Ihr Projekt überlebt hat, ist ein
Grund zum Feiern. Es ist übrigens ganz normal, wenn Ihnen etwas mulmig zu
Mute ist, aber das Fest kann Ihnen dabei helfen, etwas von der Spannung loszu-
werden, die sich bestimmt angestaut hat.
Wartung
Wartung ist eigentlich der normale Zustand eines XP-Projekts. Sie müssen gleich-
zeitig neue Funktionalit ät produzieren, das vorhandene System am Laufen hal-
ten, neue Leute in das Team aufnehmen und sich von Mitgliedern verabschie-
den, die das Unternehmen verlassen.
Jede Version beginnt mit der Erforschungsphase. Sie k önnen hier Refactoring-
Versuche durchführen, zu denen Sie in der Endphase der letzten Version nicht
den Mut hatten. Sie k önnen neue Technologien ausprobieren, die Sie in der
nächsten Version einsetzen wollen, oder auf neue Versionen der Technologie
umstellen, die Sie bereits verwenden. Sie experimentieren vielleicht mit neuen
Ideen f ür die Architektur. Der Kunde schreibt m öglicherweise verr ückte neue
Storycards, in der Hoffnung, damit einen Verkaufsrenner zu kreieren.
Ein System zu entwickeln, das bereits in Produktion ist, ist nicht das Gleiche, wie
ein System zu entwickeln, das noch nicht in Produktion ist. Man nimmt vorsich-
tige Veränderungen vor. Man muss darauf gefasst sein, die Entwicklung zu unter-
brechen, um auf Produktionsprobleme zu reagieren. Man hat reale Daten, die
man migrieren muss, wenn man das Design ändert. Wenn die Vorproduktions-
phase nicht so gefährlich wäre, würde man nie in Produktion gehen.
--- PAGE 156 ---
136 21 Lebenszyklus eines idealen XP-Projekts
Wenn das System in Produktion geht, wird sich Ihre Entwicklungsgeschwindig-
keit ändern. Seien Sie bei neuen Aufwandssch ätzungen konservativ. Verfolgen
Sie während der Erforschungsphase, inwieweit sich die Unterst ützung der Pro-
duktion auf Ihre Entwicklungst ätigkeit niederschlägt. Ich habe erlebt, dass das
Verhältnis zwischen idealer Entwicklungszeit und Kalenderzeit um 50% anstieg,
nachdem die Software in Produktion gegangen ist (von zwei Kalendertagen pro
Entwicklungstag auf drei). Raten Sie aber nicht, messen Sie.
Bereiten Sie sich darauf vor, die Teamstruktur zu ändern, um den laufenden
Betrieb bzw. die Produktion unterst ützen zu k önnen. Sie sollten sich bei der
Besetzung des »Helpdesk« abwechseln, sodass der überwiegende Teil der Pro-
grammierer nicht die meiste Zeit mit Produktionsunterbrechungen zu tun hat.
Sorgen Sie dafür, dass alle Programmierer diese Position einmal besetzen – man-
che Dinge, die man aus der Unterst ützung der Produktion lernen kann, kann
man nirgends sonst lernen. Andererseits macht es nicht so viel Spaß wie das Pro-
grammieren.
Gehen Sie mit neu entwickelter Software in Produktion, sobald sie fertig ist. Sie
wissen vielleicht, dass nicht alle Teile der Software ausgef ührt werden. Nehmen
Sie sie trotzdem in das Produktionssystem auf. Ich war an Projekten beteiligt, bei
denen dies täglich oder wöchentlich geschah; Sie sollten aber Code auf jeden Fall
nicht l änger als eine Iteration lang brachliegen lassen. Die Zeitplanung h ängt
davon ab, wie viel die Verifizierung und Migration kostet. Das Letzte, was man
am Ende eines Releaseszyklus gebrauchen kann, ist die Integration einer Menge
Code, der »unmöglich« etwas zerst ören kann. Wenn man die Produktionscode-
basis und die Entwicklungscodebasis auf einem ann ähernd gleichen Stand h ält,
wird man viel früher vor Integrationsproblemen gewarnt.
Wenn neue Mitglieder in das Team kommen, geben Sie ihnen zwei oder drei Itera-
tionen lang Aufgaben, bei denen sie viele Fragen stellen, als Paarprogrammierer ar-
beiten und eine Menge Tests und Code lesen müssen. Wenn sie dazu bereit sind,
können sie die Verantwortung für einige Entwicklungsaufgaben übernehmen, al-
lerdings mit einem reduzierten Belastungsfaktor. Wenn sie gezeigt haben, dass sie
der Aufgabe gewachsen sind, können sie ihren Belastungsfaktor anheben.
Falls sich das Team langsam ändert, kann man in weniger als einem Jahr das
ursprüngliche Entwicklungsteam durch neue Leute ersetzen, ohne die Produk-
tionsunterstützung oder die laufende Entwicklung zu unterbrechen. Das ist eine
weit weniger riskante Übergabe als das sonst übliche »das ist es und dieser Papier-
stapel enthält alle Informationen, die Sie brauchen. » Es ist in der Tat genauso
wichtig, die Projektkultur wie die Details des Designs und der Implementierung
zu kommunizieren, und das kann nur durch persönlichen Kontakt geschehen.
--- PAGE 157 ---
 Tod 137
Tod
Ein angenehmer Tod ist ebenso wichtig wie ein angenehmes Leben. Dies gilt f ür
XP genauso wie für Menschen.
Wenn dem Kunden keine neuen Storycards mehr einfallen, dann ist es an der
Zeit, das Projekt einzumotten. Jetzt muss nur noch eine fünf- bis zehnseitige Ein-
führung in das System geschrieben werden, die Art von Dokument, die man
gerne hätte, wenn etwas nach fünf Jahren verändert werden muss.
Ein guter Grund f ür den Tod ist, wenn der Kunde mit dem System zufrieden ist
und ihm nichts mehr einfällt, was er in absehbarer Zukunft dem System hinzufü-
gen möchte. (Ich habe so etwas noch nicht erlebt, aber ich habe davon geh ört
und es aus diesem Grund hier aufgenommen.)
Es gibt aber auch einen weniger guten Grund für den Tod – das System entspricht
einfach nicht den Erwartungen. Der Kunde braucht Leistungsmerkmale, die das
Team einfach nicht hinzuf ügen kann, ohne unwirtschaftlich zu arbeiten. Die
Fehlerrate steigt so stark an, dass sie untragbar wird.
Dies ist der entropische Tod, gegen den man so lange gek ämpft hat. XP ist kein
Zauber. Die Entropie holt irgendwann auch XP-Projekte ein. Man hofft einfach,
dass dies eher später als früher passiert.
In jedem Fall haben wir bereits das Unm ögliche postuliert – das System muss
sterben. Jeder sollte dies aufmerksam verfolgen. Das Team muss sich der Ökono-
mie dieser Situation bewusst sein. Das Team, die Kunden und die Manager soll-
ten darin übereinstimmen können, dass das Team und das System nicht mehr
das bringen können, was benötigt wird.
Dann ist es an der Zeit, freundlich voneinander Abschied zu nehmen. Feiern Sie.
Laden Sie alle ein, die an dem System gearbeitet haben, zur ückzukommen und
der guten alten Zeiten zu gedenken. Ergreifen Sie die Gelegenheit und versuchen
Sie, die Ursachen f ür den Untergang des Systems aufzusp üren, damit Sie lernen,
auf was Sie in der Zukunft achten müssen. Stellen Sie sich mit dem Team zusam-
men vor, was man das nächste Mal besser machen kann.
--- PAGE 159 ---
22 Rollenverteilung
Bestimmte Rollen müssen besetzt werden, damit ein XP-Team funktioniert – Program-
mierer, Kunde, Coach, Terminmanager.
Ein Sportteam funktioniert am besten, wenn es bestimmte Rollen gibt, für die
jemand die Verantwortung übernimmt. Beim Fußball gibt es den Torhüter, den
Stürmer, den Abstauber und so weiter. Beim Basketball gibt es einen Verteidiger,
einen Mittelfeldspieler, einen Angriffsspieler und so weiter.
Ein Spieler, der eine dieser Positionen innehat, übernimmt ein bestimmtes Maß
an Verantwortung – die Mitglieder des eigenen Teams dirigieren, um Punkte zu
machen, die andere Mannschaft am Punktemachen hindern, einen bestimmten
Bereich des Spielfelds überwachen. Einige der Rollen sind die von regelrechten
Einzelkämpfern. Andere erfordern, dass der Spieler die Fehler von Mannschafts-
kameraden wettmacht oder ihr Zusammenspiel steuert.
Diese Rollen werden zur Gewohnheit und gelegentlich sogar in den Spielregeln
verankert, da sie funktionieren. Irgendwann einmal ist wahrscheinlich jede Kom-
bination von Verantwortlichkeiten schon einmal ausprobiert worden. Die Rol-
len, die heute da sind, gibt es, weil sie sich bewährt haben und die anderen nicht.
Gute Coachs können einen Spieler dazu bringen, auf ihrer Position gut zu spie-
len. Sie stellen Abweichungen vom üblichen Verhalten dieser Position fest und
helfen entweder dem Spieler, diese Abweichungen zu korrigieren, oder wissen,
warum dieser Spieler sich auf der Position etwas anders verhält.
Ein hervorragender Coach ist sich jedoch bewusst, dass es sich bei diesen Positio-
nen einfach um eine gewohnheitsmäßige Aufteilung handelt, nicht um Naturge-
setze. Von Zeit zu Zeit ändert sich das Spiel oder die Spieler ändern sich so sehr,
dass eine neue Position möglich und eine alte Position obsolet wird. Hervorra-
gende Coachs suchen immer nach Möglichkeiten, wie man sich durch die Schaf-
fung neuer und die Eliminierung üblicher Positionen Vorteile verschaffen kann.
Eine weitere Fähigkeit guter Coach besteht darin, das System an die Spieler anzu-
passen, statt umgekehrt. Wenn man ein System hat, das hervorragend funktio-
niert, sofern man schnelle Spieler hat, und das eigene Team groß und stark ist,
dann sollte man besser ein neues System finden, das die Talente des Teams för-
dert. Viele Coachs sind dazu nicht in der Lage. Sie sind stattdessen so auf die
Schönheit »des Systems« konzentriert, dass sie nicht bemerken, dass es nicht
funktioniert.
--- PAGE 160 ---
140 22 Rollenverteilung
Seien Sie also gewarnt. Es werden einige Rollen beschrieben, die sich in vorherigen
Projekten bewährt haben. Wenn Sie mit Leuten zu tun haben, die nicht zu diesen
Rollen passen, ändern Sie die Rollen. Versuchen Sie nicht, die Leute zu ändern (we-
nigstens nicht allzu sehr). Verhalten Sie sich nicht so, als gäbe es keine Probleme.
Wenn eine Rolle besagt: »Diese Person muss gewillt sein, gro ße Risiken einzuge-
hen«, und Sie haben es stattdessen mit einem Pedanten zu tun, dann müssen Sie
eine andere Verteilung von Verantwortlichkeiten finden, die Ihre Ziele erf üllt,
ohne die besagte Rolle durch einen Abenteurer füllen zu können.
Beispielsweise habe ich einmal mit einem Manager über eines seiner Teams
gesprochen. Ein Programmierer war zugleich der Kunde. Ich sagte, dass dies
unmöglich funktionieren k önne, da der Programmierer den Prozess ausf ühren
und technische Entscheidungen f ällen muss, gesch äftliche Entscheidungen
jedoch dem Kunden überlassen muss (siehe den Abschnitt »Das Planungsspiel«
in Kapitel 15).
Der Manager stritt mit mir. »Der Typ ist ein richtiger Finanzmakler«, sagte er, »er
kann nur zufällig auch noch programmieren. Die anderen Finanzmakler m ögen
ihn und respektieren ihn und sind bereit, ihm zu vertrauen. Er hat eine solide
Vorstellung davon, wie das System aussehen wird. Die anderen Programmierer
können unterscheiden, wann er als Kunde spricht und wann er technische Ent-
scheidungen fällt.«
Gut. Die Regeln besagen, dass ein Programmierer nicht gleichzeitig der Kunde
sein kann. In diesem Fall gelten die Regeln aber nicht. Was immer noch gilt, ist
die Trennung von geschäftlichen und technischen Entscheidungen. Das gesamte
Team, der Programmierer/Kunde und insbesondere der Coach müssen sich darü-
ber im Klaren sein, welche Rolle der Programmierer/Kunde zu einem bestimmten
Zeitpunkt einnimmt. Und der Coach muss sich bewusst sein, dass diese Doppel-
rolle eine mögliche Ursache von Problemen darstellt, wenn das Team in Schwie-
rigkeiten gerät, auch wenn sich diese Anordnung in der Vergangenheit bew ährt
haben mag.
Programmierer
Der Programmierer steht im Mittelpunkt von XP. Wenn Programmierer Ent-
scheidungen treffen könnten, bei denen kurz- und langfristige Interessen sorgfäl-
tig gegeneinander abgewogen w ären, dann w ürde man au ßer Programmierern
eigentlich keine anderen technisch versierten Mitarbeiter im Projekt brauchen.
Natürlich gäbe es auch keinen Bedarf f ür Programmierer, wenn der Kunde eine
Software nicht unbedingt bräuchte, um sein Geschäft zu führen, und daher darf
man sich nicht allzu viel darauf einbilden, ein wichtiger Programmierer zu sein.
--- PAGE 161 ---
 Programmierer 141
Oberflächlich betrachtet ähnelt das Dasein als XP-Programmierer stark dem
Dasein der Programmierer in anderen Softwareentwicklungsdisziplinen. Man
verbringt seine Zeit mit dem Bearbeiten von Programmen, indem man sie größer,
einfacher, schneller macht. Die Schwerpunkte sind jedoch ganz anders verteilt.
Ihre Arbeit ist nicht getan, wenn der Computer versteht, was er tun soll. Ihr
oberstes Ziel ist, mit anderen Leuten zu kommunizieren. Wenn das Programm
läuft, aber eine wichtige Kommunikationskomponente noch nicht fertig ist,
dann sind Sie noch nicht fertig. Sie schreiben Tests, die einen wichtigen Aspekt
der Software darstellen. Sie teilen das Programm in kleinere Komponenten auf
oder führen Komponenten, die zu klein sind, in gr ößere, kohärente Komponen-
ten zusammen. Sie finden ein Benennungssystem, das Ihre Absichten besser zum
Ausdruck bringt.
Es gibt Fertigkeiten, die Sie als XP-Programmierer besitzen m üssen, die bei ande-
ren Arten der Softwareentwicklung nicht erforderlich sind oder auf die dort
weniger Wert gelegt wird. Das Programmieren in Paaren l ässt sich erlernen, aber
oft stehen dem die Arbeitsweise der Leute entgegen, die typischerweise Program-
mierer werden. Vielleicht sollte ich das weniger wortreich ausdr ücken: Compu-
terfreaks sind in der Regel nicht besonders kommunikativ. Es gibt mit Sicherheit
Ausnahmen und man kann auch lernen, mit anderen Leuten zu reden, aber es ist
und bleibt eine Tatsache, dass man mit anderen Programmierern kommunizie-
ren und eng zusammenarbeiten muss, um erfolgreich zu sein. 
Eine weitere Fertigkeit, die von XP-Programmierern gefordert wird, ist die F ähig-
keit zur Vereinfachung. Wenn der Kunde sagt, »Sie m üssen das, das und das
tun«, dann müssen Sie darauf vorbereitet sein, zu diskutieren, ob und in welchen
Ausmaß diese Dinge wirklich erforderlich sind. Einfachheit bezieht sich auch auf
den Code, den man schreibt. Ein Programmierer, der jedes neue Analyse- und
Designmuster parat hat, wird wahrscheinlich in XP nicht sehr erfolgreich sein.
Natürlich kann man bessere Arbeit leisten, wenn mehr Tools zur Verf ügung ste-
hen, aber es ist viel wichtiger, über eine Hand voll Tools zu verf ügen, die man
kennt und gut einsetzen kann, als alles über alles zu wissen und eine zu aufwän-
dige Lösung zu riskieren. 
Man benötigt natürlich auch Fertigkeiten, die eher technischer Natur sind. Man
muss einigerma ßen gut programmieren k önnen. Man muss in der Lage sein,
Refactoring zu betreiben, wobei es sich um eine Fertigkeit handelt, die mindes-
tens ebenso komplex und schwer ist wie das Programmieren. Man muss seinen
Code mithilfe von Komponententests testen k önnen, wozu, wie beim Refacto-
ring, Geschmack und Urteilsvermögen erforderlich sind.
--- PAGE 162 ---
142 22 Rollenverteilung
Man muss zu Gunsten gemeinsamer Verantwortung bereit sein, die Verantwor-
tung f ür einen bestimmten Teil des Systems aufzugeben. Wenn jemand den
Code ändert, den Sie geschrieben haben, dann m üssen Sie den Änderungen ver-
trauen und von ihnen lernen, ganz gleich, um welchem Teil des Systems es sich
handelt. Wenn die Änderungen schlecht sind, dann müssen Sie natürlich versu-
chen, es besser zu machen.
Vor allem muss man bereit sein, vier Ängste einzugestehen. Jeder hat Angst
davor:
 für dumm gehalten zu werden
 für nutzlos gehalten zu werden
ü berflüssig zu werden
 nicht gut genug zu sein
Ohne Mut funktioniert XP einfach nicht. Sie w ürden die ganze Zeit damit
beschäftigt sein, nicht zu scheitern. Wenn Sie stattdessen bereit sind, mit der
Unterstützung Ihres Teams Ihre Ängste einzugestehen, dann werden Sie zu
einem Team gehören, das Spaß daran hat, großartige Software zu schreiben.
Kunde
Der Kunde ist die andere H älfte der grundlegenden Dualit ät von XP. Der Pro-
grammierer weiß, wie man programmiert. Der Kunde wei ß, was programmiert
werden muss. Nun gut, vielleicht nicht am Anfang, aber der Kunde ist genauso
gewillt dazuzulernen wie der Programmierer.
Es ist nicht einfach, XP-Kunde zu sein. Man muss sich bestimmte Fertigkeiten,
z.B. Storycards schreiben, und eine Haltung aneignen, die einem zum Erfolg ver-
helfen. Vor allem aber muss man sich daran gewöhnen, ein Projekt beeinflussen,
aber nicht kontrollieren zu k önnen. Kräfte, die nicht der Kontrolle des Kunden
unterliegen, formen ebenso wie die Entscheidungen des Kunden das, was tat-
sächlich erstellt wird. Änderungen der Gesch äftsbedingungen, der Technologie
oder der Zusammensetzung und Fähigkeiten des Teams haben alle einen gro ßen
Einfluss darauf, welche Software fertig gestellt wird.
Man muss Gesch äftsentscheidungen f ällen. Dies war f ür einige Kunden, mit
denen ich gearbeitet habe, die am schwersten zu erlernende Fertigkeit. Die Kun-
den sind gewohnt, dass die IT-Abteilung nicht die H älfte von dem fertig stellt,
was sie verspricht, oder dass das, was sie fertig stellt, zur H älfte falsch ist. Der
Kunde hat gelernt, den W ünschen der IT-Abteilung nie nachzugeben, da man
--- PAGE 163 ---
 Kunde 143
sowieso entt äuscht werden wird. XP funktioniert mit einem solchen Kunden
nicht. Wenn Sie XP-Kunde sind, ist das Team darauf angewiesen, dass Sie eindeu-
tig sagen k önnen: »Das ist wichtiger als dies «, »So viel von diesem Leistungs-
merkmal ist ausreichend «, »Diese Gruppe von Leistungsmerkmalen ist ausrei-
chend.« Und wenn der Terminplan eng wird – und er wird immer eng –, dann
muss das Team in der Lage sein, die Meinung des Kunden zu ändern. »Nun gut,
ich denke, wir brauchen dies im n ächsten Quartal nicht unbedingt. « Ist der
Kunde in der Lage, solche Entscheidungen zu treffen, kann das Team unter
Umständen die Situation retten und seinen Stress so weit verringern, dass es dem
Kunden sein Bestes geben kann.
Die besten Kunden sind diejenigen, die das in Entwicklung befindliche System
tatsächlich verwenden werden und die dar über hinaus eine bestimmte Perspek-
tive auf das Problem haben, das es zu l ösen gilt. Wenn Sie solch ein Kunde sind,
dann m üssen Sie sich dar über im Klaren sein, dass Sie Dinge oft auf eine
bestimmte Art und Weise angehen, weil Sie das immer so gehandhabt haben,
und nicht, weil dies in einer bestimmten grundlegenden Qualit ät des Problems
begründet liegt. Falls Sie das System nicht selbst einsetzen, dann müssen Sie sich
umso mehr anstrengen, um die Anforderungen der tatsächlichen Anwender kor-
rekt repräsentieren zu können.
Sie m üssen lernen, wie man Storycards schreibt. Anfangs scheint dies eine
unmöglich zu bewältigende Aufgabe zu sein, aber das Team gibt Ihnen umfang-
reiche Feedbacks zu den ersten Storycards, die Sie schreiben, sodass Sie rasch ler-
nen werden, wie umfangreich die Beschreibung sein soll und welche Informatio-
nen darin aufzunehmen oder auszuschließen sind.
Sie müssen lernen, Funktionstests zu schreiben. Falls Sie der Kunde einer mathe-
matischen Anwendung sind, dann ist diese Aufgabe einfach – einige Minuten
oder Stunden mit einer Tabellenkalkulation zu verbringen sollte ausreichen, die
für den Testfall erforderlichen Daten zu erstellen. Vielleicht erstellt aber auch das
Team ein Tool für Sie, das die Eingabe neuer Testfälle erleichtert. Programme mit
einer formelhaften Grundlage (z.B. ein Arbeitsablauf) erfordern ebenso Funk-
tionstests. Sie müssen in diesem Fall eng mit dem Team zusammenarbeiten, um
herauszufinden, welche Dinge getestet werden sollen und welche Arten von
Tests redundant sind. Einige Teams stellen Ihnen vielleicht technische Unterstüt-
zung zur Seite, die Ihnen bei der Auswahl, der Erarbeitung und der Ausf ührung
der Tests behilflich ist. Ihr Ziel sollte es sein, Tests zu schreiben, von denen Sie
sagen können: »Wenn diese Tests fehlerfrei laufen, dann bin ich mir sicher, dass
das System fehlerfrei läuft.«
--- PAGE 164 ---
144 22 Rollenverteilung
Tester
Da ein gro ßer Teil der Verantwortung f ür die Tests auf den Schultern der Pro-
grammierern ruht, ist die Rolle des Testers in einem XP-Team wirklich auf den
Kunden konzentriert. Der Tester ist verantwortlich daf ür, dem Kunden bei der
Auswahl und der Erarbeitung von Funktionstests zu helfen. Falls die Funktions-
tests nicht Bestandteil der Integrationsreihe sind, dann ist der Tester daf ür ver-
antwortlich, die Funktionstests regelm äßig auszuf ühren und die Ergebnisse an
gut und für alle sichtbarer Stelle bekannt zu geben.
Ein XP-Tester ist nicht eigens dazu abgestellt, Fehler im System zu entdecken und
die Programmierer zu dem ütigen. Jemand muss allerdings die Tests regelm äßig
ausführen (falls man nicht gleichzeitig Komponententests und Funktionstests
ausführen kann), die Ergebnisse bekannt geben und sicherstellen, dass die Test-
tools einwandfrei funktionieren.
Terminmanager
Als Terminmanager stellt man das Gewissen des Teams dar. 
Zu guten Aufwandssch ätzungen zu kommen ist eine Frage der Übung und des
Feedbacks. Man muss eine Menge Aufwandssch ätzungen anstellen und dann
prüfen, ob die Wirklichkeit die Schätzungen bestätigt. Aufgabe des Terminmana-
ger ist es, die Feedbackschleife zu schlie ßen. Wenn das Team das n ächste Mal
Schätzungen trifft, dann muss der Terminmanager sagen k önnen: »Zwei Drittel
Eurer Aufwandsschätzungen waren letztes Mal um mindestens 50% zu hoch.« Zu
einzelnen Programmierern muss der Terminmanager sagen k önnen: »Deine Ein-
schätzungen sind entweder viel zu hoch oder viel zu niedrig.« Die nächsten Auf-
wandsschätzungen liegen nach wie vor in der Verantwortung der Leute, die das
implementieren, was gesch ätzt wird, aber der Terminmanager muss ihnen das
Feedback gegeben haben, sodass die nächsten Schätzungen besser als die vorher-
gehenden sein können.
Der Terminmanager ist zudem verantwortlich, das gesamte Projekt im Auge zu
behalten. Etwa zur Halbzeit einer Iteration sollte er dem Team sagen k önnen, ob
es den Liefertermin halten kann, wenn es den gegenw ärtigen Kurs weiter ver-
folgt, oder ob es etwas ändern muss. Nach einigen Iterationen eines verpflichten-
den Terminplans sollte man dem Team sagen können, ob es die nächste Version,
ohne große Änderungen vorzunehmen, rechtzeitig fertig stellen kann.
--- PAGE 165 ---
 Coach 145
Der Terminmanager ist der Historiker des Teams. Er verzeichnet die Ergebnisse
der Funktionstests. Er f ührt Protokoll über die gemeldeten Fehler oder M ängel,
wer dafür die Verantwortung übernahm und welche Testfälle wegen dieser Män-
gel hinzugefügt wurden.
Der Terminmanager muss sich insbesondere darin üben, die benötigten Informa-
tionen zu sammeln, ohne den Arbeitsablauf mehr als unbedingt erforderlich zu
stören. Er soll den Arbeitsablauf ein klein wenig stören, um den Teammitgliedern
bewusst zu machen, wie lange sie an einer Aufgabe wirklich arbeiten, was ihnen
nicht so klar w äre, wenn der Terminmanager nicht fragen w ürde. Er darf aller-
dings nicht so lästig werden, dass ihm die Teammitglieder aus dem Weg gehen.
Coach
Als Coach ist man f ür den Gesamtprozess verantwortlich. Der Coach merkt,
wenn einzelne Leute eine falsche Richtung einschlagen und macht das Team
darauf aufmerksam. Er bleibt ruhig, wenn alle anderen in Panik geraten, und
denkt daran, dass man innerhalb der n ächsten zwei Wochen nur die Arbeit von
zwei Wochen oder weniger erledigen kann und dass das entweder ausreicht oder
nicht.
Jeder im XP-Team muss bis zu einem gewissen Grad verstehen k önnen, wie XP
im Team angewendet wird. Vom Coach wird ein viel tieferes Verst ändnis erwar-
tet – welche alternativen Verfahren bei der aktuellen Problemlage weiterhelfen
können, wie andere Teams XP einsetzen, welche Konzepte hinter XP stehen und
in welcher Beziehung diese zur aktuellen Situation stehen.
Ich fand an der Arbeit eines Coachs am schwierigsten, dass man die besten
Ergebnisse erzielt, wenn man indirekt vorgeht. Wenn man einen Fehler im
Design findet, muss man zuerst entscheiden, ob der Fehler so schwerwiegend ist,
dass interveniert werden muss. Mit jedem Mal, das man das Team in eine andere
Richtung lenkt, nimmt man ihm etwas Selbstbewusstsein. Wenn man zu viel
lenkt, dann verliert das Team seine F ähigkeit, ohne Coach zu arbeiten, was zu
geringerer Produktivität, geringerer Qualit ät und einer geringeren Arbeitsmoral
führt. Als Coach muss man daher zuerst entscheiden, ob das erkannte Problem
so ernst ist, dass man das Risiko des Intervenierens auf sich nimmt. 
Wenn man zu dem Schluss kommt, man es wirklich besser als das Team wei ß,
dann sollte man so unaufdringlich wie m öglich seine Meinung darlegen. Es ist
beispielsweise weit besser, einen Testfall vorzuschlagen, der sich nur sauber
implementieren l ässt, wenn man das Design korrigiert, als einfach loszulegen
--- PAGE 166 ---
146 22 Rollenverteilung
und das Design selbst zu korrigieren. Es ist aber eine Kunst, nicht auf direkte
Weise zu sagen, wie man etwas sieht, sondern es so auszudrücken, dass das Team
es auch so sehen kann.
Gelegentlich muss man allerdings direkt sein, so direkt, dass es unhöflich wirken
kann. Zuversichtliche, aggressive Programmierer sind genau deswegen wertvoll,
weil sie zuversichtlich und aggressiv sind. Sie sind dadurch aber auch oft von
einer gewissen Art von Blindheit geschlagen, die sich nur durch unverbl ümtes
Reden heilen l ässt. Wenn man zugelassen hat, dass sich eine Situation bis zu
einem Punkt entwickelt hat, an dem die sanfte Hand am Z ügel nichts mehr
bewirkt, dann muss man bereit sein, die Z ügel fest in beide H ände zu nehmen
und zu lenken. Aber nur so lange, bis sich das Team wieder gefangen hat. Dann
muss man eine Hand wieder loslassen.
Ich möchte hier etwas über die Fertigkeiten eines Coachs sagen. Ich bin stets in
der Position, die Fertigkeiten von XP zu unterrichten – einfaches Design, Refacto-
ring, Testen. Ich denke aber nicht, dass dies ein notwendiger Bestandteil der Auf-
gabenbeschreibung eines Coachs ist. Wenn man ein in technischer Hinsicht sou-
veränes Team hat, das aber in seinem Prozess Unterstützung braucht, dann kann
man als Coach fungieren, ohne ein Technikexperte zu sein. Man muss die Tech-
nikfreaks immer noch davon überzeugen, dass sie einem zuh ören. Wenn die
Fähigkeiten erst einmal entwickelt sind, besteht meine Aufgabe meist darin, das
Team daran zu erinnern, auf welche Art und Weise es sich in bestimmten Situati-
onen verhalten wollte.
Die Rolle des Coachs wird immer unbedeutender, wenn das Team reifer wird.
Gemäß der Prinzipien der verteilten Kontrolle und der Übernahme von Verant-
wortung sollte »der Prozess« in der Verantwortung aller liegen. Am Beginn der
Umstellung auf XP ist dies von den Programmierern zu viel verlangt.
Berater
XP-Projekte bringen nicht viele Spezialisten hervor. Da jeder mit jedem ein Paar
bilden kann und die Partner so h äufig wechseln und jeder f ür eine bestimmte
Aufgabe die Verantwortung übernehmen kann, ist die Wahrscheinlichkeit
gering, dass sich in dem System schwarze L öcher entwickeln, die nur ein oder
zwei Leute verstehen.
Das ist eine St ärke, da das Team extrem flexibel ist; aber es ist auch eine Schw ä-
che, da das Team manchmal eingehende technische Kenntnisse braucht. Die
Betonung, die auf ein einfaches Design gelegt wird, tr ägt dazu bei, dass dies sel-
ten vorkommt, aber es kommt eben von Zeit zu Zeit vor.
--- PAGE 167 ---
 Big Boss 147
In diesem Fall braucht das Team einen Berater. Wenn Sie Berater sind, dann sind
Sie wahrscheinlich nicht mit XP vertraut. Sie werden wahrscheinlich das, was das
Team tut, mit einem gewissen Ma ß an Skepsis betrachten. Das Team muss sich
aber über das Problem vollkommen klar sein, das es l ösen muss. Es sollte Ihnen
Tests zur Verfügung stellen können, die genau zeigen, wann das Problem gel öst
ist (das Team wird sogar auf diese Tests bestehen).
Das Team wird aber sicher nicht zulassen, dass Sie sich zur ückziehen und das
Problem allein lösen. Es wird wahrscheinlich viele Fragen stellen. Man wird Ihr
Design und Ihre Annahmen infrage stellen, um zu sehen, ob man nicht etwas
Einfacheres findet, das ebenso gut funktioniert.
Und wenn Sie fertig sind, wirft das Team wahrscheinlich alles weg, was Sie getan
haben, und beginnt von vorn. Das darf Sie nicht kränken. Das Team tut sich das-
selbe jeden Tag in geringem Ma ße an und etwa einmal im Monat wirft man
einen ganzen Tag Arbeit weg.
Big Boss
Wenn Sie der Big Boss sind, dann sind Sie vor allem dazu da, dem Team Mut und
Zuversicht zu geben und gelegentlich darauf zu bestehen, dass das Team das tut,
was es zu tun behauptet. Es wird f ür Sie anfangs wahrscheinlich schwierig sein,
mit dem Team zu arbeiten. Das Team wird Sie bitten, es häufig zu überprüfen. Es
wird die Konsequenzen von Änderungen in einer bestimmten Situation erl äu-
tern. Wenn Sie dem Team beispielsweise nicht den neuen Tester besorgen, den es
angefordert hat, dann wird es Ihnen genau erkl ären, wie sich dies auf den Ter-
minplan auswirken wird. Wenn Sie die Antwort des Teams nicht m ögen, wird
das Team Sie dazu auffordern, den Umfang des Projekts zu reduzieren.
Da dies von einem XP-Team kommt, handelt es sich um ehrliche Kommunika-
tion. Das Team jammert nicht, ganz bestimmt. Das Team m öchte, dass Sie so
bald wie möglich erfahren, wenn es vom Plan abweicht, damit Sie möglichst viel
Zeit haben, darauf zu reagieren.
Das Team ist auf Ihren Mut angewiesen, da das, was es tut, Ihnen manchmal ver-
rückt vorkommen kann, insbesondere wenn Sie aus der Softwareentwicklung
kommen. Einige der Ideen werden Sie anerkennen und billigen, wie die starke
Betonung des Testens. Einige scheinen anfangs v öllig abwegig zu sein, wie z.B.
dass das Programmieren in Paaren eine produktivere und effizientere Weise des
Programmierens ist oder dass die ständige Verfeinerung des Designs eine weniger
riskante Weise ist, ein Design zu entwerfen. Beobachten Sie das Team eine Weile,
und schauen Sie sich an, was es produziert. Wenn es nicht funktioniert, k önnen
--- PAGE 168 ---
148 22 Rollenverteilung
Sie einschreiten. Wenn es funktioniert, dann haben Sie es geschafft, weil Sie ein
Team haben, das produktiv arbeitet, das die Kunden zufrieden stellt und das alles
tut, um Sie niemals böse zu überraschen.
Das heißt nicht, dass das Team nicht von Zeit zu Zeit Fehler macht. Es wird Feh-
ler machen. Sie sehen sich an, was das Team tut, und es erscheint Ihnen nicht
sinnvoll. Sie bitten das Team um eine Erklärung und die Erklärung ist auch nicht
sinnvoll. In solchen Momenten verlässt sich das Team darauf, dass Sie es stoppen
und auffordern, die eigene Arbeit genauer zu betrachten. Sie sind nicht ohne
Grund auf dieser Position. Das Team m öchte Ihre F ähigkeit f ür sich nutzen,
wenn es sie braucht. Ehrlich gesagt, möchte es nicht in den Genuss dieser Fähig-
keit kommen, wenn es sie nicht braucht.
--- PAGE 169 ---
23 Die 20:80-Regel
Die Bedeutung von XP kommt erst dann voll zum Tragen, wenn alle Verfahren einge-
setzt werden. Viele dieser Verfahren lassen sich schrittweise übernehmen, ihre Wirkung
potenziert sich jedoch, wenn sie alle zusammen im Einsatz sind.
Softwareprogrammierer sind daran gewöhnt, mit der 20:80-Regel umzugehen,
die besagt, dass 80% des Gewinns aus 20% der Arbeit stammen. XP nutzt diese
Regel für sich – man geht mit den wertvollsten 20% an Funktionalität in Produk-
tion, stellt die wertvollsten 20% des Designs fertig und verlässt sich auf die 20:80-
Regel, um Optimierungen aufzuschieben.
Damit die 20:80-Regel anwendbar ist, muss das fragliche System über bestimmte
Kontrollmöglichkeiten verfügen, die relativ unabhängig voneinander sind.
Wenn ich beispielsweise das Leistungsverhalten eines Programms optimiere,
dann hat jede Stelle, die ich optimieren könnte, im Allgemeinen Einfluss auf
andere Stellen, die ich optimieren könnte. Ich werde mich nie in einer Lage
befinden, in der ich die langsamste Funktion optimiere und dann feststelle, dass
ich auf Grund dieser Optimierung die nächste Funktion nicht optimieren kann.
In einem System mit voneinander unabhängigen Kontrollmöglichkeiten müssen
einige dieser Kontrollmöglichkeiten wichtiger als andere sein.
Ward Cunningham erzählt von einem Buch, das ihm geholfen hat, sich auf Ski-
abfahrten für Fortgeschrittene zu wagen, namens The Athlethic Skier
1. Das halbe
Buch handelt davon, wie man seine Stiefel einstellt, damit man den Berg fühlt
und im Gleichgewicht ist. Dann heißt es in dem Buch: »Aber Sie werden nur 20%
der Fortschritte bemerken, nachdem Sie 80% dieser Übungen ausgeführt haben.«
Dann wird erklärt, dass es einen großen Unterschied macht, ob man im Gleich-
gewicht ist oder ob man nicht im Gleichgewicht ist. Wenn man ein wenig aus
dem Gleichgewicht geraten ist, dann kann man genauso gut auch stark aus dem
Gleichgewicht sein. Und es sind eine Menge kleiner Faktoren, wie die richtige
Passform der Stiefel, die bewirken, dass man das Gleichgewicht hält. Wenn einer
dieser Faktoren nicht stimmt, dann stimmt das Gleichgewicht nicht mehr. Man
bemerkt langsam Fortschritte, aber die letzten Änderungen, die Sie vornehmen,
werden eine große Wirkung haben.
Ich denke (und das ist nur eine Hypothese), das XP dem gleicht. Die Verfahren
und Prinzipien arbeiten zusammen und unterstützen einander gegenseitig, um
eine Synergie zu erzeugen, die größer als die Summe der einzelnen Teile ist. Es
1. Warren Witherell und Dough Evrard, The Athlethic Skier, Johnson Books, 1993
--- PAGE 170 ---
150 23 Die 20:80-Regel
liegt nicht blo ß daran, dass Sie testen, sondern Sie testen ein einfaches System,
und es wurde einfach, da Sie einen Programmierpartner hatten, der Sie zum
Refactoring aufforderte, Sie daran erinnerte, mehr Tests zu schreiben, und Sie
lobte, wenn Sie etwas Kompliziertes vereinfacht haben und ...
Dies stellt uns vor ein Dilemma. Bedeutet XP, dass man alles oder nichts w ählen
muss? Müssen wir diese Verfahren haargenau einhalten und riskieren sonst, dass
wir keine Fortschritte machen? Keineswegs. Einzelne Elemente von XP k önnen
bedeutende Vorteile bringen. Ich glaube lediglich daran, dass man sehr viel mehr
gewinnen kann, wenn man alle Einzelteile zusammenfügt.
--- PAGE 171 ---
24 Was macht XP schwierig?
Obwohl die einzelnen Verfahren von einfachen Programmierern ausgeführt werden
können, ist es schwierig, alle Einzelteile zusammenzufügen und zusammenzuhalten. Es
sind vor allem die Empfindungen – insbesondere Angst –, die XP schwierig machen.
Wenn mich Leute über XP reden hören, sagen sie »Aber bei Ihnen hört sich das
so einfach an.« Nun, das liegt daran, dass es einfach ist. Man muss kein Dokter
der Informatik sein, um zu einem XP-Projekt beitragen zu können (ehrlich gesagt
haben die Doktoren sogar die meisten Schwierigkeiten damit).
XP ist einfach in seinen Details, aber schwierig in der Ausübung.
Lesen wir den Satz nochmals. XP ist einfach, aber es ist nicht leicht? Genau. Die
Verfahren, aus denen sich XP zusammensetzt, lassen sich von jedem erlernen,
der einen anderen überzeugt hat, ihn dafür zu bezahlen, dass er programmiert.
Das ist nicht der schwierige Teil. Der schwierige Teil ist, alle Einzelteile zusam-
menzufügen und sie dann im Gleichgewicht zu halten. Die Einzelteile neigen
dazu, sich gegenseitig zu unterstützen, aber es gibt viele Probleme, Bedenken,
Ängste, Ereignisse und Fehler, die den Prozess aus dem Gleichgewicht bringen
können. Der einzige Grund, warum man einen erfahrenen Techniker dafür
»opfert«, die Rolle des Coachs zu übernehmen, besteht darin, dass es so schwierig
ist, den Prozess im Gleichgewicht zu halten. 
Ich möchte Ihnen keine Angst machen. Nicht mehr als unbedingt erforderlich.
Die meisten Softwareentwicklungsgruppen könnten XP praktizieren. (Ausnah-
men werden im nächsten Kapitel beschrieben.)
Folgende Dinge fand ich sowohl schwierig an XP, wenn ich es auf meinen eige-
nen Code anwende, als auch, wenn ich als Coach von Teams diene, die XP über-
nehmen. Ich möchte nicht, dass Sie sich diese Probleme aneignen, aber wenn der
Übergang zu XP schwer fällt (und ich verspreche Ihnen, diese Tage wird es
geben), sollten Sie wissen, dass Sie mit diesen Schwierigkeiten nicht alleine sind.
Sie tun sich schwer, weil Sie etwas Schwieriges tun.
Es ist schwierig, einfache Dinge zu tun. Es scheint verrückt, aber gelegentlich ist
es leichter, etwas Kompliziertes zu tun als etwas Einfaches. Das ist insbesondere
dann wahr, wenn man in der Vergangenheit erfolgreich komplizierte Dinge
getan hat. Zu lernen, die Welt auf möglichst einfache Weise zu sehen und darzu-
stellen, ist ein großes Talent und eine Herausforderung. Die Herausforderung
besteht darin, dass Sie möglicherweise Ihr Wertesystem ändern müssen. Statt
--- PAGE 172 ---
152 24 Was macht XP schwierig?
beeindruckt zu sein, wenn jemand (beispielsweise Sie) etwas Kompliziertes zum
Laufen bringt, m üssen Sie lernen, mit Kompliziertem unzufrieden zu sein und
nicht eher zu ruhen, bevor Sie sich nichts Einfacheres mehr vorstellen k önnen,
was gleichermaßen funktioniert.
Es fällt schwer, zuzugeben, dass man etwas nicht weiß. Dies macht aus der Über-
nahme von XP eine pers önliche Herausforderung, da XP eine Disziplin ist, die
auf der Pr ämisse basiert, dass man nur so schnell entwickeln kann, wie man
lernt. Und wenn man lernt, hei ßt dies, dass man es zuvor nicht wusste. Es mag
vielleicht eine beängstigende Vorstellung für Sie sein, zum Kunden zu gehen und
ihn zu bitten, Ihnen zu erklären, was für ihn die grundlegendsten Konzepte sind.
Es wird Sie ängstigen, sich Ihrem Programmierpartner zuzuwenden und zuzuge-
ben, dass es einige grundlegende Dinge in der Informatik gibt, die Sie niemals
richtig verstanden haben oder die Sie vergessen haben.
Es ist schwierig, mit jemanden zusammenzuarbeiten. Unser gesamtes Bildungs-
system zielt auf individuelle Leistung ab. Wenn man mit jemandem an einem
Projekt arbeitet, nennt der Lehrer das Schummeln und bestraft einen. Die Gratifi-
kationssysteme der meisten Unternehmen, die auf individuellen Leistungsbewer-
tungen und Gehaltserh öhungen basieren (und oft als Nullsummenspiel besetzt
werden), f ördern zudem das individuelle Leistungsdenken. Sie m üssen wahr-
scheinlich neue Fertigkeiten im Umgang mit Leuten lernen, wenn Sie so eng in
einem Team zusammenarbeiten wie in XP.
Es ist schwierig, emotionale Schwellen zu überwinden. Das reibungslose Funktio-
nieren eines XP-Projekts beruht auf dem st ändigen Umgang mit Emotionen.
Wenn jemand frustriert oder w ütend ist und nicht dar über spricht, dauert es
nicht lange, bis das Team nicht mehr die erwarteten Leistungen erbringt. Wir
haben gelernt, unser Gef ühlsleben von unserem Arbeitsleben zu trennen, aber
das Team kann nicht effizient funktionieren, wenn die Kommunikation nicht
aufrechterhalten wird, Ängste nicht eingestanden, Wut nicht entladen und
Freude nicht geteilt werden.
Wenn sich dies so anhört, als sei XP eine dieser Erfahrungen, von denen Althip-
pies schwärmen, dann ist das ein Missverst ändnis. Ich habe von XP eine andere
Vorstellung. Ich habe versucht, Software zu entwickeln, indem ich so tat, als
hätte ich keine Gef ühle, und eben diese Distanz auch von meinen Kollegen
gefordert habe. Es hat nicht funktioniert. Ich rede dar über, wie ich mich f ühle,
wenn andere dar über reden, wie sie sich f ühlen, und der Prozess l äuft viel rei-
bungsloser ab.
--- PAGE 173 ---
24 Was macht XP schwierig? 153
Die XP-Verfahren sind dem entgegengesetzt, was wir geh ört, gesagt und viel-
leicht in der Vergangenheit erfolgreich praktiziert haben. Eine der gro ßen
Schwierigkeiten besteht einfach darin, wie anders XP aussieht. Wenn ich einen
neuen Manager zum ersten Mal treffe, habe ich oft Angst, dass ich mich radikal
oder verrückt oder unpraktisch anh öre. Ich kenne allerdings kein besseres Ver-
fahren, Software zu entwickeln, und daher überwinde ich diese Angst schlie ß-
lich. Machen Sie sich aber auf heftige Reaktionen gefasst, wenn Sie XP erläutern.
Kleine Probleme k önnen eine gro ße Wirkung haben. Ich halte die Grundlagen
von XP f ür recht robust, sodass der Prozess eine Menge Variationen tolerieren
kann. Kleinigkeiten haben aber oft gro ße Auswirkungen. In dem Chrysler-C3-
Projekt zur Entwicklung eines Gehaltsabrechnungssystems hatte das Team ein-
mal Schwierigkeiten damit, seine Aufwandssch ätzungen einzuhalten. Eine Itera-
tion nach der anderen wurden ein oder zwei Leistungsmerkmale gestrichen, da
man sie nicht rechtzeitig implementieren konnte. Es hat drei oder vier Monate
gedauert, bis ich der Ursache des Problems auf die Spur kam. Ich hörte jemanden
vom »Erster-Dienstag-Syndrom« reden. Ich fragte, was das sei, und das Teammit-
glied antwortete: »Das Gefühl, das man am Tag nach dem Iterationsplanungs-
Meeting bekommt, wenn man ins B üro kommt, sich seine Storycards ansieht
und erkennt, dass man nicht wei ß, wie man sie innerhalb der gesch ätzten Zeit
implementieren soll.«
Ich hatte den Prozess ursprünglich wie folgt definiert:
1. Aufgaben übernehmen.
2. Die übernommenen Aufgaben einschätzen.
3. Ausgleichen, falls jemand zu viele Aufgaben übernommen hat.
Das Team wollte den dritten Schritt vermeiden und hat den Prozess wie folgt
abgeändert:
1. Aufgaben gemeinsam einsch ätzen.
2. Aufgaben übernehmen.
Das Problem war, dass die Person, die Verantwortung f ür eine Aufgabe über-
nahm, nicht für deren Aufwandsschätzung verantwortlich war. Die Teammitglie-
der kamen am nächsten Tag ins Büro und sagten: »Warum dauert das drei Tage?
Ich wei ß nicht einmal, was daf ür alles erforderlich ist. « Sie werden vermuten,
dass dies für einen Programmierer nicht der produktivste Zustand ist. Die Leute
haben in jeder Iteration auf Grund des »Erster-Dienstag-Syndroms« einen oder
zwei Tage verloren. Kein Wunder, dass sie ihre Ziele nicht erreicht haben.
--- PAGE 174 ---
154 24 Was macht XP schwierig?
Ich erwähne diese Geschichte, um zu illustrieren, dass kleine Probleme im Pro-
zess große Auswirkungen haben können. Ich möchte damit nicht sagen, dass Sie
alles genauso machen sollten, wie ich es hier sage oder dass es Ihnen sonst Leid
tun wird. Sie müssen nach wie vor die Verantwortung f ür Ihren eigenen Prozess
übernehmen. Genau das macht XP so schwierig – indem Sie Verantwortung f ür
Ihren eigenen Entwicklungsprozess übernehmen, sind Sie daf ür verantwortlich,
auf Probleme aufmerksam zu werden und sie zu lösen.
Projekte durch fortw ährende, kleine Richtungskorrekturen zu steuern wider-
spricht der Vorstellung des »In-die-richtige-Richtung-Zeigens«, die in vielen
Unternehmen vorherrscht. Eine letzte Schwierigkeit, eine, die ein XP-Projekt
leicht zum Absturz bringen kann, besteht darin, dass in vielen Unternehmens-
kulturen diese Art des Steuerns einfach nicht akzeptiert wird. Fr üh vor Proble-
men zu warnen gilt als Anzeichen von Schwäche oder Jammerei. Sie müssen Mut
haben, wenn die Firma Sie auffordert, sich widerspr üchlich zu dem Prozess zu
verhalten, den Sie für sich gewählt haben.
--- PAGE 175 ---
25 Wann man XP nicht ausprobieren sollte
Die genauen Grenzen von XP sind noch nicht klar. Es gibt aber einige Bedingungen, die
mit absoluter Gewissheit das Funktionieren von XP verhindern – große Teams, miss-
trauische Kunden, eine Technologie, die Veränderungen nicht unterstützt.
Es gibt Verfahren in XP, die unabhängig davon empfehlenswert sind, was Sie von
der Sache insgesamt halten. Sie sollten diese Verfahren ausprobieren. Punkt. Tes-
ten ist ein gutes Beispiel hierfür. Das Planungsspiel funktioniert wahrscheinlich,
auch wenn man vorab mehr Zeit für Aufwandsschätzungen und das Design auf-
wendet. Wie die 20:80-Regel besagt, besteht wahrscheinlich jedoch ein großer
Unterschied zwischen dem Einsatz aller Verfahren und nicht aller Verfahren.
Ehrlich gesagt, sollte man nicht sämtliche Details von XP überall erzählen. Es
gibt Zeiten, Orte, Leute und Kunden, die ein XP-Projekt wie einen Luftballon
zum Platzen bringen können. Es ist wichtig, XP nicht in solchen Projekten einzu-
setzen. Es ist ebenso wichtig, XP dann nicht anzuwenden, wenn dieses Konzept
scheitern muss, wie es wichtig ist, XP einzusetzen, wenn es echte Vorteile bietet.
Darum geht es in diesem Buch – zu entscheiden, wann man XP verwenden sollte
und wann nicht.
Ich werde Ihnen aber trotzdem nicht raten, XP nicht zu verwenden, wenn Sie
Raketensprengköpfe bauen. Ich habe noch nie Software für Raketensprengköpfe
entwickelt, und daher weiß ich nicht, wie es dabei zugeht. Daher kann ich Ihnen
nicht sagen, dass XP dort funktionieren wird. Ich kann Ihnen aber genauso
wenig sagen, dass es nicht funktionieren wird. Wenn Sie Software für Raketen-
sprengköpfe entwickeln, dann können Sie selbst entscheiden, ob XP hier einsetz-
bar ist oder nicht.
Ich bin jedoch oft genug mit XP gescheitert, sodass ich einige der Bedingungen
kenne, unter denen XP nicht funktioniert. Betrachten Sie dies als eine Liste der
Umgebungen, von denen ich weiß, dass sie sich nicht zum Einsatz von XP eignen.
Das größte Hindernis für den Erfolg eines XP-Projekts ist die Kultur. Nicht die
nationale Kultur, obwohl auch die eine Rolle spielt, sondern die Unternehmens-
kultur. Jedes Unternehmen, das Projekte abwickelt, indem es dem Team die Rich-
tung vorgibt, wird sich mit einem Team schwer tun, das darauf besteht, selbst zu
lenken.
Eine Variante des Vorgebens einer Richtung ist die große Spezifikation. Wenn ein
Kunde oder Manager darauf besteht, eine komplette Spezifikation oder Analyse
oder ein komplettes Design zu haben, bevor man mit einer Kleinigkeit wie dem
--- PAGE 176 ---
156 25 Wann man XP nicht ausprobieren sollte
Programmieren beginnt, dann wird es unvermeidlich Differenzen zwischen der
Kultur des Teams und der des Kunden oder Managers geben. Das Projekt mag
trotzdem in der Lage sein, XP erfolgreich einzusetzen, aber es wird nicht leicht
sein. Das Team wird den Kunden oder Manager auffordern, ein Dokument, das
ihm das Gefühl von Kontrolle vermittelt, gegen einen Dialog einzutauschen (das
Planungsspiel), der andauerndes Engagement erfordert. F ür eine Person, die
bereits überlastet ist, kann das sehr beängstigend sein.
Andererseits habe ich mit einem Bankkunden gearbeitet, der Berge von Papier
liebte. Der Kunde bestand w ährend des gesamten Projekts darauf, dass wir das
System »dokumentieren«. Wir sagten ihm, dass wir dies gerne tun würden, wenn
er damit einverstanden ist, weniger Funktionalit ät gegen mehr Papier einzutau-
schen. Wir haben monatelang von dieser »Dokumentation« zu h ören bekom-
men. W ährend das Projekt fortschritt und es deutlich wurde, wie wichtig die
Tests für die Stabilität des Systems und für die Kommunikation dessen waren, für
welche Verwendung Objekte vorgesehen waren, wurde das Gerede von der
Dokumentation immer leiser, obwohl es immer noch da war. Am Ende sagte der
Entwicklungsleiter, er wolle eigentlich nur eine vierseitige Einf ührung in die
Hauptobjekte des Systems. Was ihn betraf, hatte niemand, der alles Übrige, was
er brauchte, nicht dem Code und den Tests entnehmen konnte, das Recht dazu,
den Code zu bearbeiten.
Eine andere Kultur, die sich nicht mit XP vertr ägt, ist diejenige, die Sie zwingt,
Überstunden zu machen, um Ihr »Engagement für die Firma« zu beweisen. Man
kann XP nicht praktizieren, wenn man müde ist. Wenn ein Team so schnell wie
möglich arbeitet und das Ergebnis dem Unternehmen nicht ausreicht, dann ist
XP nicht die richtige Lösung. Werden in einem XP-Projekt zwei aufeinander fol-
gende Wochen lang Überstunden gemacht, dann ist dies ein sicheres Zeichen
dafür, dass mit dem Prozess etwas nicht stimmt und dass man dies besser korri-
giert.
Wirklich intelligente Programmierer tun sich manchmal schwer mit XP. F ür die
Intelligenten kann es am schwersten sein, das Spiel »Richtig Tippen« gegen stän-
dige Kommunikation und fortwährende Evolution einzutauschen.
Die Größe ist mit Sicherheit von Belang. Man k önnte wahrscheinlich kein XP-
Projekt mit einhundert Programmierern durchf ühren – auch nicht mit f ünfzig
und wahrscheinlich auch nicht mit zwanzig. Mit zehn Programmierern geht es
sicher. Besteht das Team aus drei oder vier Programmierern, dann kann man
einige der Verfahren, die sich auf die Koordination der Programmierer konzent-
rieren (wie das Iterationsplanungsspiel), gefahrlos über Bord werfen. Zwischen
der Menge der zu produzierenden Funktionalit ät und der Menge der Personen,
--- PAGE 177 ---
25 Wann man XP nicht ausprobieren sollte 157
die diese produzieren, gibt es keine einfache lineare Beziehung. Wenn man es
mit einem großen Projekt zu tun hat, kann man mit XP experimentieren und XP
einen Monat lang mit einem kleinen Team ausprobieren, um festzustellen, wie
schnell man mit XP entwickeln kann.
Der eigentliche Flaschenhals bei der Anpassung der Teamgr öße ist der Integrati-
onsprozess. Man muss diesen Prozess auf irgendeine Weise erweitern, um mehr
Codestränge handhaben zu k önnen, als beim Einsatz eines einzelnen Integra-
tionsrechners möglich wären.
Sie sollten XP nicht einsetzen, wenn Sie eine Technologie verwenden, die eine
exponentielle Kostenkurve bedingt. Wenn Sie beispielsweise das x-te Gro ßrech-
nersystem für dieselbe relationale Datenbank entwickeln und sich nicht absolut
sicher sind, dass das Datenbankschema Ihren Anforderungen entspricht, dann
sollten Sie XP nie und nimmer einsetzen. XP beruht darauf, dass der Code sauber
und einfach ist. Wenn Sie den Code kompliziert gestalten, damit er mit 200 vor-
handenen Anwendungen kompatibel ist, dann werden Sie bald die Flexibilit ät
verlieren, um deretwillen Sie XP übernommen haben.
Eine andere technologische Barriere für XP ist eine Umgebung, in der Feedbacks
nur sehr langsam erfolgen können. Wenn es z.B. 24 Stunden dauert, ein System
zu kompilieren und zu linken, dann kann man schwerlich mehrmals t äglich
integrieren, erstellen und testen. Wenn man einen zweimonatigen Qualit ätssi-
cherungsprozess durchlaufen muss, bevor man mit der Software in Produktion
gehen kann, dann kann man kaum genug lernen, um erfolgreich zu sein.
Ich habe Umgebungen erlebt, in denen es einfach unm öglich war, Software rea-
listisch zu testen – man arbeitet in der Produktion mit einem Millionen von
Mark teuren Rechner, der voll ausgelastet ist, und es gibt einfach keinen weiteren
solchen Rechner im Unternehmen. Oder es gibt so viele Kombinationen m ögli-
cher Probleme, dass man keine sinnvolle Testreihe innerhalb eines Tages ausfüh-
ren kann. In diesem Fall ist es ganz richtig, nachzudenken statt zu testen. Aber
dann praktiziert man nicht mehr XP. Als ich in dieser Art von Umgebung pro-
grammierte, hatte ich immer Hemmungen, das Design weiterzuentwickeln. Ich
musste von vornherein Flexibilit ät einbauen. Man kann auch auf diese Weise
gute Software erstellen, aber man sollte dazu nicht XP verwenden.
Erinnern Sie sich an die Geschichte mit den Programmierern in den Eckb üros?
Wenn man die falsche physische Umgebung hat, kann XP nicht funktionieren.
Ein gro ßer Raum mit kleinen Arbeitsnischen an den Au ßenwänden und leis-
tungsfähigen Rechnern auf Tischen in der Mitte ist die beste Umgebung, die ich
kenne. Ward Cunningham erz ählt von dem WyCash-Projekt, bei dem die Pro-
--- PAGE 178 ---
158 25 Wann man XP nicht ausprobieren sollte
grammierer getrennte B üros hatten. Die B üros waren allerdings gro ß genug,
sodass zwei Leute darin bequem arbeiten konnten, und wenn Programmierer
einen Partner suchten, dann gingen sie einfach von einem B üro zum nächsten.
Wenn man die Schreibtische nicht verr ücken kann oder wenn der L ärmpegel
Gespräche unmöglich macht oder wenn man nicht nahe genug beieinander ist,
sodass sich keine zuf ällige Kommunikation ergeben kann, dann kann man XP
nicht mit dem vollen Potenzial praktizieren.
Was funktioniert mit Sicherheit nicht? Wenn die Programmierer über zwei
Stockwerke verteilt sind, hat XP keine Chance. Wenn die Programmierer weiträu-
mig über ein Stockwerk verteilt sind, hat XP keine Chance. Geografisch getrennt
könnte man m öglicherweise arbeiten, wenn man zwei Teams hat, die an ver-
wandten Projekten arbeiten, die nur begrenzt interagieren. Man k önnte auch als
ein großes Team starten, die erste Version ausliefern, das Team dann entlang der
natürlichen Bruchlinien der Anwendung aufteilen und die beiden Teile getrennt
weiterentwickeln.
Es ist schließlich völlig unmöglich, XP mit einem schreienden Baby im Raum zu
praktizieren. Das können Sie mir glauben.
--- PAGE 179 ---
26 XP in der Praxis
Die meisten üblichen Verträge können für XP-Projekte eingesetzt werden, wenn auch
mit leichten Veränderungen. Insbesondere werden Verträge mit festem Preis und festem
Umfang zu Verträgen mit festem Preis, festem Datum und mehr oder weniger festem
Umfang, wenn man das Planungsspiel anwendet.
Wie passt XP zu den üblichen Geschäftspraktiken? Die falsche Art von Vertrag
kann ein Projekt leicht zunichte machen, ungeachtet der Tools, der Technologie
und der Begabung der Mitarbeiter.
Dieses Kapitel untersucht einige Geschäftsbedingungen der Softwareentwicklung
und wie man sie mit XP einsetzen kann.
Festpreis
Man hat anscheinend die meisten Schwierigkeiten, bei einem Projekt mit einem
Festpreisvertrag XP einzusetzen. Wie kann man Verträge mit einem festen Preis,
einem festen Lieferdatum oder einem festen Umfang abschließen, wenn man das
Planungsspiel spielt? Am Ende wird man einen Vertrag mit einem festen Preis,
einem festen Lieferdatum und variablem Umfang haben.
Jedes Projekt, an dem ich mitarbeitete und das einen festen Preis und einen fes-
ten Umfang hatte, endete damit, dass beide Parteien behaupteten: »Die Anforde-
rungen waren nicht klar.« Das typische Projekt mit Festpreis und festem Umfang
zieht die beiden Parteien in genau entgegengesetzte Richtungen. Der Lieferant
möchte so wenig wie möglich tun und der Kunde möchte so viel wie möglich
fordern. In diesem Spannungsverhältnis möchten beide Parteien ein erfolgrei-
ches Projekt, sodass sie an ihren ursprünglichen Zielen Abstriche machen; Span-
nung wird jedoch immer herrschen.
In XP ändert sich diese Beziehung in subtiler, aber bedeutender Weise. Der
anfängliche Umfang ist beispielhaft. »Wir können beispielsweise für fünf Millio-
nen Mark die folgenden zwölf Leistungsmerkmale in 12 Monaten fertig stellen.«
Der Kunde muss entscheiden, ob diese Leistungsmerkmale fünf Millionen Mark
wert sind. Wenn das Team schließlich diese 12 zu Anfang genannten Leistungs-
merkmale produziert, ist das großartig. Es ist jedoch wahrscheinlich, dass der
Kunde einige dieser Leistungsmerkmale durch für ihn wertvollere ersetzt. Nie-
mand beklagt sich darüber, wenn man etwas Wertvolleres erhält. Jeder beklagt
sich, wenn man das erhält, wonach man gefragt hat, aber das nicht dem ent-
spricht, was man jetzt möchte.
--- PAGE 180 ---
160 26 XP in der Praxis
Statt eines festen Preises/Liefertermins/Umfangs bietet das XP-Team so etwas wie
ein Abonnement. Das Team arbeitet eine bestimmte Zeit lang bestm öglich für
den Kunden. Es folgt dem Kunden, wenn der etwas dazulernt. Am Beginn jeder
Iteration hat der Kunde offiziell Gelegenheit, die Richtung zu ändern und völlig
neue Leistungsmerkmale zu fordern.
Ein weiterer Unterschied von XP-Projekten ist durch die kurzen Releasezyklen
bedingt. Man würde nie 12 oder 18 Monate lang an einem XP-Projekt arbeiten,
o h n e  i n  P r o d u k t i o n  z u  s e i n .  S o b a l d  s i c h  d a s  T e a m  d a z u  v e r p f l i c h t e t  h a t ,  L e i s -
tungsmerkmale mit einem Arbeitsaufwand von insgesamt 12 Monaten zu liefern,
spielt man das Planungsspiel mit dem Kunden, um den Umfang der ersten Ver-
sion festzulegen. Bei einem Vertrag über 12 Monate kann das System nach drei
oder vier Monaten in Produktion gehen und anschlie ßend durch monatliche
oder zweimonatliche Versionen aktualisiert werden. Inkrementelle Lieferung bie-
tet dem Kunden M öglichkeiten, den Vertrag zu beenden, falls das Projekt nicht
so schnell voranschreitet wie anf änglich eingeschätzt oder wenn die Gesch äfts-
lage das gesamte Projekt nicht mehr rechtfertigt, und sie bietet M öglichkeiten,
die Richtung des Projekts zu ändern.
Outsourcing
In der typischen Entwicklung mit externen Untervertragsnehmern bekommt der
Kunde am Ende eine Menge Code, den er nicht pflegen kann. Der Kunde hat drei
Möglichkeiten.
 Er versucht, das System selbst weiterzuentwickeln, wodurch die Weiterent-
wicklung des Systems auf ein Schneckentempo verlangsamt wird.
 Er kann den urspr ünglichen Lieferanten mit der Weiterentwicklung des Sys-
tems beauftragen (der dafür möglicherweise eine Menge Geld verlangt).
 Er kann einen anderen Lieferanten engagieren, der den Code nicht gut kennt.
Man kann dies auch mit XP tun, wenn man will. Das Team könnte zum Kunden
kommen oder der Kunde könnte zum Team kommen. Man würde das Planungs-
spiel spielen, um den Arbeitsumfang festzulegen. Wenn der Vertrag erf üllt ist,
könnte das Team gehen und den Kunden mit dem Code sich selbst überlassen.
In gewisser Hinsicht wäre dies besser als die typische Outsourcing-Vereinbarung.
Der Kunde hätte zumindest die Komponenten- und Funktionstests, mit denen er
sicherstellen kann, dass von ihm vorgenommene Änderungen die vorhandene
Funktionalität nicht beeintr ächtigen. Der Kunde k önnte den Programmierern
--- PAGE 181 ---
 Insourcing 161
über die Schulter schauen, sodass er eine ungef ähre Ahnung davon h ätte, was
sich im Innern des Systems befindet. Und der Kunde w äre in der Lage, die lau-
fende Entwicklung zu lenken.
Insourcing
Sie haben vielleicht schon bemerkt, dass ich kein gro ßer Outsourcing-Fan bin.
Die Lieferung des gesamten Umfangs bei Arbeitsende, die beim Outsourcing
üblich ist, verstößt gegen das Prinzip der inkrementellen Veränderungen. Es gibt
eine Oursourcing-Variante, die XP leisten kann. Was passiert, wenn man nach
und nach die Teammitglieder durch Techniker des Kunden ersetzt? Ich
bezeichne dies als »Insourcing«.
Das Insourcing hat viele Vorteile gegen über dem Outsourcing. Beispielsweise
kann der Lieferant dem Kunden detaillierte technische Kenntnisse vermitteln.
Indem die Verantwortung für das System nach und nach verlagert wird, geht der
Kunde beim Insourcing nicht das Risiko ein, ein Programm zu erben, das er nicht
aufrechterhalten kann.
Sehen wir uns ein Insourcing-Beispiel mit einem Lieferanten und einem Team
von 10 Personen an. Der Vertrag läuft über 12 Monate. Die anfängliche Entwick-
lung dauert drei Monate, danach folgen 9 Monate lang monatliche Lieferungen.
Der Kunde stellt für die anfängliche Entwicklung einen Techniker zur Verfügung.
Danach bringt der Kunde jeden Monat eine weitere Person ins Team und der Lie-
ferant entfernt eine Person daraus. Am Ende der Vertragsdauer besteht die Hälfte
des Teams aus Angestellten des Kunden, die das Programm unterst ützen und die
Entwicklung fortsetzen können, wenn auch etwas langsamer.
Die Entwicklung wird aufgrund der h äufigen Wechsel im Team sicher nicht so
schnell voranschreiten wie bei einem klassischen Outsourcing-Vertrag, bei dem
das Team des Lieferanten stabil bleibt. Das verringerte Risiko mag es aber wert
sein.
XP unterst ützt das Insourcing, da das Team st ändig seinen Arbeitsfortschritt
misst. Da die Teammitglieder wechseln, wird das gesamte Team mal schneller,
mal langsamer arbeiten. Indem das Team st ändig die erreichte Produktivit ät
misst, kann es daran ausrichten, zu wie viel es sich in einer Iteration des Pla-
nungsspiels verpflichtet. Da Experten das Team verlassen und durch weniger
erfahrene Mitarbeiter ersetzt werden, kann das Team die verbleibenden Aufgaben
neu einschätzen.
--- PAGE 182 ---
162 26 XP in der Praxis
Abrechnung nach Aufwand
Bei Verträgen über Zeit- und Materialaufwand rechnet das XP-Team nach Stun-
den oder Tagen ab. Der übrige Prozess läuft so wie beschrieben ab.
Problematisch an solchen Verträgen ist, dass sie die Ziele des Lieferanten den Zie-
len des Kunden entgegensetzen. Der Lieferant möchte so viele Leute wie möglich
in dem Projekt einsetzen, um seine Einnahmen zu maximieren. Und der Liefe-
rant ist versucht, Überstunden machen zu lassen, um mehr Einnahmen pro
Monat zu erhalten. Der Kunde m öchte, dass in m öglichst kurzer Zeit mit m ög-
lichst wenig Leuten möglichst viel Funktionalität implementiert wird.
Wenn die Beziehung zwischen Lieferant und Kunde gut ist, können Verträge die-
ser Art funktionieren, aber es wird immer unterschwellige Spannungen geben.
Abschlussbonus
Eine ausgezeichnete Möglichkeit, die Interessen des Lieferanten und des Kunden
bei Festpreis- oder Aufwandsabrechnungsverträgen einander anzunähern, besteht
darin, einen Bonus für die rechtzeitige Fertigstellung des Projekts zu zahlen. In ge-
wisser Hinsicht ist dies f ür ein XP-Team eine Wette, die es nicht verlieren kann.
Aufgrund der Kontrolle, die es durch das Planungsspiel hat, ist es sehr wahrschein-
lich, dass es den Bonus einstreichen kann.
Das hässliche Gegenstück des Abschlussbonus ist die Strafe f ür Verzögerungen.
Auch hier verschafft das Planungsspiel dem Team wieder einen Vorteil, wenn es
einer Strafe f ür Verzögerungen zustimmt. Das Team kann ziemlich sicher sein,
dass es das System pünktlich fertig stellt, und daher ist es unwahrscheinlich, dass
es die Strafe zahlen muss.
Eine Sache, die man bei der Formulierung von Abschlussbonus- und Strafklau-
seln für XP-Projekte beachten muss, ist, dass das Planungsspiel unweigerlich in
einer Änderung des Projektumfangs resultiert. Ein Kunde, der wirklich darauf aus
ist, den Lieferanten hereinzulegen, könnte sagen: »Es ist jetzt der erste April und
Sie haben noch nicht alle Leistungsmerkmale implementiert, die im Originalver-
trag stehen. Vergessen Sie den Bonus und fangen Sie lieber an zu zahlen. « Und
der Kunde k önnte das sagen, auch wenn das System bereits erfolgreich in Pro-
duktion ist.
Im Allgemeinen stellt dies kein Problem dar. Wenn es Weihnachten ist und Ge-
schenke unter dem Baum liegen, dann zählt der Kunde wahrscheinlich nicht nach,
ob es sich um genau diejenigen Geschenke handelt, die auf seiner Wunschliste
standen, insbesondere wenn er selbst einige Geschenke ausgetauscht hat.
--- PAGE 183 ---
 Vorzeitige Beendigung 163
Vorzeitige Beendigung
Eines der Merkmale von XP besteht darin, dass der Kunde w ährend des laufen-
den Projekts genau sehen kann, was er bekommen wird. Was passiert, wenn er
auf halber Strecke entdeckt, dass das Projekt nicht mehr sinnvoll ist? F ür den
Kunden ist es Geld wert, wenn er in der Lage ist, ein Projekt vorzeitig zu been-
den. Ziehen Sie in Betracht, eine zus ätzliche Klausel in Vertr äge aufzunehmen,
die es dem Kunden erlaubt, das Projekt zu stoppen und dafür einen entsprechen-
den Anteil der Gesamtkosten zu übernehmen und dem Lieferanten vielleicht
eine zusätzliche Entschädigung dafür zu zahlen, dass er sich kurzfristig um einen
neuen Auftrag bemühen muss.
Frameworks
Kann man XP zur Entwicklung von Frameworks einsetzen? Wenn eine der
Regeln lautet, dass man jegliche Funktionalität entfernt, die nicht aktuell in Ver-
wendung ist, würde man dann nicht schlussendlich das gesamte Framework ent-
fernen?
XP eignet sich nicht besonders f ür eine »vorausplanende Wiederverwendung«.
Man würde in einem XP-Projekt niemals sechs Monate zur Erstellung von Frame-
works aufwenden und sie erst dann beginnen zu verwenden. Man w ürde auch
das »Frameworkteam« nicht vom »Anwendungsteam« trennen. In XP erstellen
wir Anwendungen. Wenn nach Jahren ständiger Verbesserungen einige Abstrak-
tionen so aussehen, als k önnten sie allgemein hilfreich sein, dann kann man
anfangen, dar über nachzudenken, wie man sie allgemein verf ügbar machen
könnte. 
Wenn der Zweck des Projekts darin besteht, ein Framework f ür die externe Ver-
wendung zu entwickeln, k önnte man XP hierzu einsetzen. Im Planungsspiel
würde die Geschäftsseite von einem Programmierer repr äsentiert, der bereits die
Art von Anwendungen wirklich entwickelt hat, die das Framework unterst ützen
soll. Die Merkmale des Frameworks würden in den Storycards auftauchen.
Wurde das Framework außerhalb des Teams entwickelt, dann muss man konser-
vativer hinsichtlich des Refactoring sein, das sichtbare Schnittstellen ändern
würde. Wenn man Kunden vor dem bevorstehenden Verschwinden eines Leis-
tungsmerkmals warnt und daf ür Missbilligung erntet, f ührt das dazu, dass man
die Schnittstelle des Framework weiterentwickelt und daf ür in Kauf nimmt, eine
Zeit lang zwei Schnittstellen zu unterstützen.
--- PAGE 184 ---
164 26 XP in der Praxis
Kommerzielle Produkte
Man kann XP auch zur Entwicklung kommerzieller Software einsetzen. Die Rolle
der Geschäftsseite wird hier von der Marketingabteilung übernommen. Sie ist es,
die herausfindet, welche Leistungsmerkmale der Markt will, wie viel von jedem
Leistungsmerkmal erforderlich ist und in welcher Reihenfolge die Leistungsmerk-
male implementiert werden sollten.
Eine weitere Möglichkeit besteht darin, einen professionellen Anwender der Soft-
ware zu engagieren, der die Gesch äftsseite repräsentiert. Beispielsweise engagie-
ren Hersteller von Computerspielen professionelle Anwender von Spielen, um
ihre Software zu testen. Softwarefirmen, die Finanzmaklersoftware entwickeln,
engagieren Makler. Wenn Sie ein Satzprogramm entwickeln, w ären Sie verrückt,
würden Sie keinen professionellen Setzer in das Team aufnehmen. Und das w äre
genau die Person, die entscheiden sollte, ob Leistungsmerkmal A oder B auf die
nächste Version verschoben wird.
--- PAGE 185 ---
27 Schlussfolgerung
Alle Methoden beruhen auf Angst. Man versucht, Gewohnheiten zu etablieren,
die verhindern, dass sich die eigenen Ängste bewahrheiten. XP unterscheidet sich
in dieser Hinsicht nicht von anderen Methoden. Der Unterschied besteht darin,
dass die Ängste in XP eingebettet werden. In dem Grad, in dem XP meine Schöp-
fung ist, reflektiert XP meine Ängste. Ich fürchte mich davor
 an etwas zu arbeiten, was nicht von Belang ist
 dass Projekte eingestellt werden, weil ich nicht genügend technische Fort-
schritte gemacht habe
 schlechte geschäftliche Entscheidungen zu treffen
 dass Geschäftsleute schlechte technische Entscheidungen für mich treffen
 am Ende meiner Laufbahn als Programmierer von Systemen angelangt zu sein
und festzustellen, dass ich nicht genügend Zeit mit meinen Kindern verbracht
habe
 Arbeit zu leisten, auf die ich nicht stolz bin
XP spiegelt auch die Dinge wider, vor denen ich keine Angst habe. Ich fürchte
mich nicht davor
 zu programmieren
 meine Meinung zu ändern
 weiterzumachen, ohne genau zu wissen, was mich in der Zukunft erwartet
 mich auf andere Leute zu verlassen
 die Analyse und das Design eines in Betrieb befindlichen Systems zu ändern
 Tests zu schreiben
Ich musste lernen, mich nicht vor diesen Dingen zu fürchten. Das war nicht
leicht, gerade weil mich so viele Stimmen davor warnten, dass es sich dabei um
genau dasjenige handelte, vor dem ich mich fürchten sollte, dasjenige, das ich
unbedingt vermeiden sollte.
--- PAGE 186 ---
166 27 Schlussfolgerung
Erwartung
Ein junger Mann ging zu einem Meister im Schwertkampf. Die beiden sa ßen in
der Sonne vor der H ütte des Meisters, als der Meister den Jungen in der ersten
Lektion unterrichtete: »Hier ist dein h ölzernes Übungsschwert. Ich kann dich
jederzeit mit meinem hölzernen Schwert treffen, und das musst du verhindern.«
Peng!
»Aua!«
»Ich sagte ‚jederzeit’.« Peng!
»Aua!«
Der Schüler hob sein Schwert und sah den Meister wütend an.
»Nein, jetzt schlage ich nicht, denn das erwartest du jetzt.«
Innerhalb der nächsten Tage holte sich der Sch üler eine nette Sammlung blauer
Flecke. Er versuchte auf alles in seiner Umgebung zu achten. Aber wann immer
seine Aufmerksamkeit nachließ, Peng!
Der Schüler konnte nicht in Ruhe essen. Er konnte nicht schlafen. Er f ürchtete
sich vor allem, schaute vorsichtig um Ecken und lauschte nach jedem kleinen
Geräusch. Aber jedes Mal, wenn seine Augen zufielen oder er verga ß, aufmerk-
sam zu lauschen, Peng!
Es dauerte nicht lange, bis er sich hinsetzte und vor Frustration weinte. »Ich
kann das nicht mehr ertragen. Ich bin nicht dazu gemacht, ein Schwertk ämpfer
zu sein. Ich gehe nach Hause. « Ohne genau zu wissen, warum, zog er in diesem
Moment sein Schwert und wirbelte herum, um den Schlag des Meisters abzublo-
cken. Der Meister sagte: »Jetzt bist du bereit zu lernen.«
Wir k önnen uns selbst mit Erwartungen verr ückt machen. Indem wir uns auf
jede vorstellbare Eventualit ät vorbereiten, machen wir uns verwundbar f ür die
Eventualitäten, die wir uns nicht vorstellen können.
Man kann an die Dinge auch anders herangehen. Das Team kann zu jedem Zeit-
punkt darauf vorbereitet sein, in jede beliebige Richtung zu gehen, die das
Geschäft oder das System erfordert. Indem das Team explizit darauf verzichtet,
sich auf Änderungen vorzubereiten, bereitet es sich paradoxerweise auf jede Art
von Änderung vor. Das Team erwartet nichts. Daher kann es auch nicht über-
rascht werden.
--- PAGE 187 ---
A Kommentierte Bibliografie
Diese Bibliografie soll Ihnen die Möglichkeit geben, jene Aspekte von XP einge-
hender kennen zu lernen, die Sie interessieren.
Philosophie
Sue Bender, Plain and Simple: A Woman’s Journey to the Amish , HarperCollins,
1989; ISBN 0062501860 (dt.: Sue Bender: So einfach wie das Leben. Eine Frau bei
den Amischen; die Geschichte einer Wandlung, List 1996, ISBN 3-471-77190-5)
Mehr ist nicht besser. Weniger ist aber auch nicht besser.
Leonhard Coren, Wabi-Sabi: For Artists, Designers, Poets, and Philosophers , Stone
Bridge Press, 1994; ISBN 1880656124
XP hat nicht irgendeine Art von transzendentaler Perfektion der Programme
zum Ziel. Wabi-Sabi ist eine ästhetische Verherrlichung des Ungeschliffenen
und Funktionalen.
Richard Coyne, Designing Information Technology in the Postmodern Age: From
Method to Metaphor, MIT Press, 1995; ISBN 0262032287
Behandelt die Unterschiede zwischen modernistischem und postmodernem
Denken, ein Thema, das XP durchzieht. Enthält zudem eine ausgezeichnete
Diskussion zur Bedeutung von Metaphern.
Philip B. Crosby, Quality is Free: The Art of Making Quality Certain , Mentor Books,
1992; ISBN 0451625854
Bricht aus dem Nullsummenmodell der vier Variablen – Zeit, Umfang, Kosten
und Qualität – aus. Man kann Software nicht schneller fertig stellen, indem
man an der Qualität Abstriche macht. Stattdessen stellt man Software schnel-
ler fertig, indem man die Qualität erhöht.
George Lakoff und Mark Johnson, Philosophy in the Flesh: The Embodied Mind and
Its Challenge to Western Thought, Basic Books, 1998; ISBN 0465056733
Eine weitere gute Abhandlung zu den Themen Metaphern und Denken. Die
Beschreibung, wie sich Metaphern vermischen und völlig neue Metaphern
formen, ähnelt dem, was im Denken der Softwareentwicklung passiert. Die
alten Metaphern, die aus dem Bauingenieurswesen, der Mathematik usw.
übernommen werden, verwandeln sich langsam zu einer eindeutigen Soft-
wareentwicklungsmetapher.
--- PAGE 188 ---
168 A Kommentierte Bibliografie
Bill Mollison und Rena Mia Slay, Introduction into Permaculture, Ten Speed Press,
1997; ISBN 0908228082
Die in der westlichen Welt praktizierte hochintensive Nutzung wird in der
Regel mit Ausbeutung und Ersch öpfung assoziiert. Permaculture ist eine Dis-
ziplin aus der Landwirtschaft, deren Ziel darin besteht, durch die Synergie-
effekte einfacher Verfahren eine anhaltende hochintensive Nutzung zu
ermöglichen. Von besonderem Interesse ist der Gedanke, dass das meiste
Wachstum dort vorkommt, wo Bereiche miteinander interagieren. Permacul-
ture maximiert die Interaktionen durch spiralf örmige Pflanzungen und Seen
mit stark unregelm äßigen Formen. XP maximiert die Interaktionen durch
Kunden vor Ort und die Programmierung in Paaren.
Geisteshaltung
Christopher Alexander, Notes on the Synthesis of Form , Harvard University Press,
1970; ISBN 0674627512
Christopher Alexander betrachtet das Design als Entscheidungen, mit denen
widersprüchliche Zwänge gelöst werden, die wiederum zu weiteren Entschei-
dungen führen, mit denen auf die verbleibenden Zwänge eingegangen wird.
Christopher Alexander, The Timeless Way of Building , Oxford University Press,
1979; ISBN 0195024028
Die beschriebene Beziehung zwischen Designern/Erbauern und den Bewoh-
nern der Gebäude ähnelt stark der Beziehung zwischen Programmierern und
Kunden.
Cynthia Heimel, Sex Tips for Girls , Simon & Schuster, 1983; ISBN 0671477250
(dt.:Cynthia Heimel: Sex-Tips für Girls. Goldmann 1998, 3-442-44194-3) 
Die ultimative Technik ist echter Enthusiasmus. Ist der gegeben, ergibt sich
alles andere von selbst. Fehlt er, kann man es vergessen.
The Princess Bride, Rob Reiner, Regisseur, MGM/UA Studios, 1987.
»We’ll never make it out alive.« 
(»Wir werden hier niemals lebend herauskommen.«)
»Nonsense. You’re just saying that because no one ever has.« 
(»Unsinn. Das sagst das nur, weil es noch nie jemand getan hat.«)
Field Marshal Irwin Rommel, Attacks: Rommel, Athena, 1979; ISBN 0960273603
Unterhaltsame Beispiele für das Vorgehen unter anscheinend hoffnungslosen
Umständen.
--- PAGE 189 ---
 Prozesse 169
Frank Thomas und Ollie Johnston, Disney Animation: The Illusion of Life , Hyper-
ion, 1995; ISBN 0786860707
Beschreibt, wie sich die Teamstruktur bei Disney über die Jahre entwickelt
hat, um mit wirtschaftlichen und technologischen Änderungen umgehen zu
können. Enthält auch viele gute Tipps für das Benutzeroberflächendesign und
einige wirklich gute Bilder.
Prozesse
Christopher Alexander, Sara Ishikawa und Murray Silverstein, A Pattern Language,
Oxford University Press, 1977; ISBN 0195019199 (dt.: Christopher Alexander,
Sara Ishikawa und Murray Silverstein: Eine Mustersprache. Städte, Gebäude, Kon-
struktion. Löcker 1995, 3-85409-179-6)
Beispiel f ür ein Regelsystem, das aufstrebende Eigenschaften hervorbringen
soll. Man kann dar über diskutieren, ob diese Regeln erfolgreich sind oder
nicht, aber die Regeln selbst sind ein interessanter Lesestoff. Enthält auch eine
ausgezeichnete, wenn auch zu kurze Abhandlung zum Design von Arbeits-
plätzen.
James Gleick, Chaos: Making a New Science, Penguin USA, 1988; ISBN 0140092501
(dt.: James Gleick: Chaos – die Ordnung des Universums. Vorstoß in Grenzberei-
che der modernen Physik. Droemer Knaur 1990, 3-426-04078-6)
Eine sanfte Einführung in die Chaostheorie.
Stuart Kauffman, At Home in the Universe: The Search for Laws of Self-Organization
and Complexity , Oxford University Press, 1996; ISBN 0195111303 (dt.: Stuart
Kauffmann: Der Öltropfen im Wasser. Chaos, Komplexität, Selbstorganisation in
Natur und Gesellschaft. Piper 1998, 3-492-22654-X)
Eine weniger sanfte Einführung in die Chaostheorie.
Roger Lewin, Complexity: Life at the Edge of Chaos , Collier Books, 1994; ISBN
0020147953 (dt.: Roger Lewin: Die Komplexit ätstheorie. Wissenschaft nach der
Chaosforschung. Droemer Knaur 1996, 3-426-77190-X)
Noch mehr Chaostheorie.
Margaret Wheatley, Leadership and the New Science , Berrett-Koehler Pub, 1994;
ISBN 1881052443
Beantwortet die Frage: Was passiert, wenn man die Theorie der sich selbst
organisierenden ordnenden Systeme als Metapher f ür das Management ver-
wendet?
--- PAGE 190 ---
170 A Kommentierte Bibliografie
Systeme
Gerald Weinberg, Quality Software Management: Volume 1, Systems Thinking , Dor-
set House, 1991; ISBN 0932633226 (dt.: Gerald Weinberg: Systemdenken und
Softwarequalität. Hanser 1994, 3-446-17713-2)
Ein System und eine Notation für die Betrachtung von Systemen miteinander
interagierender Aktionen.
Norbert Wiener, Cybernetics, MIT Press, 1961; ISBN 1114238089 (dt.: Norbert
Wiener: Kybernetik. Regelung und Nachrichten übermittlung in Lebewesen und
Maschinen. Rowohlt 1968)
Eine wesentlich tiefergehende, wenn auch schwierigere Einf ührung in Sys-
teme.
Warren Witherell und Doug Evrard, The Athletic Skier, Johnson Books, 1993; ISBN
1555661173
Ein System voneinander abh ängiger Regeln f ür das Skifahren. Quelle der
20:80-Regel.
Menschen
Tom DeMarco und Timothy Lister, Peopleware, Dorset House, 1999; ISBN
0932633439 (dt.: Tom DeMarco und Timothy Lister: Wien wartet auf Dich! Der
Faktor Mensch im DV-Management. Hanser 1991, 3-446-16229-1)
Als Nachfolger des Titels The Psychology of Computer Programming  erweitert
dieses Buch den praktischen Dialog über Programme, die von Menschen und
insbesondere von Teams geschrieben werden. Dieses Buch war die Quelle
meines Prinzips der »übernommenen Verantwortung«.
Carlo d’Este, Fatal Decision: Anzio and the Battle for Rome , Harper-Collins, 1991;
ISBN 006092148X
Beschreibt, was passiert, wenn das Ego dem klaren Denken im Weg steht.
Robert Kanigel, The One Best Way: Frederick Winslow Taylor and the Enigma of Effi-
ciency, Penguin, 1999; ISBN 0140260803
Ein Biographie Taylors, die seine Arbeit in einen Kontext stellt, der die Gren-
zen seines Denkens aufzeigt.
Gary Klein, Sources of Power, MIT Press, 1999; ISBN 0262611465
Ein einfacher, lesbarer Text darüber, wie erfahrene Leute in schwierigen Situa-
tionen tatsächlich Entscheidungen treffen.
--- PAGE 191 ---
 Menschen 171
Thomas Kuhn, The Structure of Scientific Revolutions , University of Chicago Press,
1996; ISBN 0226458083 (dt.: Thomas Kuhn: Die Struktur wissenschaftlicher
Revolutionen. Suhrkamp 1973)
XP ist f ür manche Leute ein Paradigmenwechsel. Paradigmenwechsel haben
vorhersehbare Auswirkungen. Hier werden einige davon beschrieben.
Scott McCloud, Understanding Comics, Harper Prennial, 1994; ISBN 006097625X
(dt.: Scott MacCloud: Comics richtig lesen. Carlsen-Studio 1994, 3-551-72113-0)
Die letzten Kapitel handeln davon, warum Leute Comics schreiben. Mich
regte das dazu an, dar über nachzudenken, warum ich Programme schreibe.
Das Buch enth ält auch gutes Material über die Beziehung zwischen dem
Handwerk des Comic-Schreibens und der Kunst der Comics, welche vergleich-
bar sind mit dem Handwerk des Schreibens von Programmen (Testen, Refac-
toring) und der Kunst des Programmierens. Es enth ält zudem gutes Material
für Benutzeroberfl ächendesigner zu den Fragen, wie man durch Freir äume
zwischen Dingen kommuniziert und wie man Informationen übersichtlich in
kleine Räume packt.
Geoffrey A. Moore, Crossing the Chasm: Marketing and Selling High-Tech Products to
Mainstream Customers, HarperBusiness, 1999; ISBN 0066620023
Paradigmenwechsel aus der Geschäftsperspektive. Verschiedene Leute werden
darauf vorbereitet sein, XP in verschiedenen Stadien seiner Evolution zu über-
nehmen. Einige der Hindernisse sind vorhersehbar und k önnen mithilfe ein-
facher Strategien angegangen werden.
Frederick Winslow Taylor, The Principles of Scientific Management , Institute of
Industrial Engineers, 2. Aufl., 1998 (1. Aufl. 1911); ISBN 089801822 (dt.: Frede-
rick Taylor: Die Grunds ätze wissenschaftlicher Betriebsf ührung. Raben-Verlag
1983)
Dies ist das Buch, das den »Taylorismus« begründete. Durch Spezialisierung
und striktes Teilen und Herrschen konnten mehr Autos billiger produziert
werden. Meiner Erfahrung nach eignen sich diese Prinzipien nicht als Strate-
gien für die Softwareentwicklung, sie sind hier weder in wirtschaftlicher Hin-
sicht, noch in menschlicher Hinsicht sinnvoll.
Barbara Tuchman, Practicing History, Ballantine Books, 1991; ISBN 0345303636
(dt.: Barbara Tuchman: In Geschichte denken. Claasen 1982, 3-546-49188-2)
Eine umsichtige Historikerin denkt dar über nach, warum sie Geschichte
betreibt. Wie Understanding Comics regt dieses Buch dazu an, darüber nachzu-
denken, warum man das tut, was man tut.
--- PAGE 192 ---
172 A Kommentierte Bibliografie
Colin M. Turnbull, The Forest People: A Study of the Pygmies of the Congo, Simon &
Schuster, 1961; ISBN 0671640992 (dt.: Colin M. Tumbull: Molimo. 3 Jahre bei
den Pygmäen. Köln, Berlin 1963)
Eine Gesellschaft, die über eine Fülle von Ressourcen verfügt. Mein Traum ist,
dass es möglich wäre, dieses Gefühl in einem Team zu erzeugen.
Colin M. Turnbull, The Mountain People,  Simon & Schuster, 1972; ISBN
0671640984 (dt.: Colin M. Tumbull: Das Volk ohne Liebe. Der soziale Untergang
der Ik (=Mountain). Rowohlt 1973)
Eine Gesellschaft mit knappen Ressourcen. Beschreibt zutreffend einige Pro-
jekte, an denen ich beteiligt war. Ich m öchte nie mehr diese Art von Leben
führen.
Mary Walton und W. Edwards Deming, The Deming Management Method, Perigee,
1988; ISBN 0399550011
Deming geht ausdrücklich auf Angst als Leistungsschranke ein. Jeder konzent-
riert sich auf die statistischen Methoden zur Qualit ätskontrolle, aber dieses
Buch hat eine Menge über menschliche Gefühle und deren Auswirkungen zu
sagen.
Gerald Weinberg, Quality Software Management: Volume 4, Congruent Action , Dor-
set House, 1994; ISBN 0932633285
Wenn man etwas sagt und etwas anderes tut, dann passieren schlimme
Dinge. Dieses Buch geht darauf ein, wie man sein Reden und Handeln in
Übereinstimmung bringt, wie man Inkongruenzen in anderen erkennt und
was man dagegen tun kann.
Gerald Weinberg, The Psychology of Computer Programming , Dorset House, 1998;
ISBN 0932633420
Programme werden von Menschen geschrieben. Erstaunlich, nicht wahr?
Erstaunlich, dass eine Menge Leute das immer noch nicht begreifen ...
Gerald Weinberg, The Secrets of Consulting, Dorset House, 1986; ISBN 0932633013
Strategien für die Einführung von Änderungen. Nützlich für jeden Coach.
Projektmanagement
Fred Brooks, The Mythical Man-Month, Addison-Wesley, 1995; ISBN 0201835959
Geschichten, die Sie dazu bringen, über die vier Variablen nachzudenken. Die
Jubiläumsausgabe enthält auch ein interessantes Gespräch über den berühm-
ten Artikel »No Silver Bullet«.
--- PAGE 193 ---
 Projektmanagement 173
Brad Cox und Andy Novobilski, Object-Oriented Programming – An Evolutionary
Approach, Addison-Wesley, 1991; ISBN 0201548348
Ursprung des elektrotechnischen Paradigmas der Softwareentwicklung.
Ward Cunningham, »Episodes: A Pattern Language of Competitive Develop-
ment«, in Pattern Languages of Program Design 2 , John Vlissides, Hrsg., Addison-
Wesley, 1996; ISBN 0201895277 (auch http://c2.com/ppr/episodes.html)
Viele Ideen von XP wurden zum ersten Mal in diesem Artikel ausgedrückt.
Tom DeMarco, Controlling Software Projects , Yourdon Press, 1982; ISBN
0131717111 (dt.: Tom DeMarco: Software-Projektmanagement. Wie man Kosten,
Zeitaufwand und Risiko kalkulierbar plant. Wolfram ’s Fachverlag 1989,
3-925328-92-0)
Ausgezeichnete Beispiele dazu, wie man Feedbacks erzeugt und einsetzt, um
Messdaten über Softwareprojekte zu erhalten.
Tom Gilb, Principles of Sofware Engineering Management , Addison-Wesley, 1988;
ISBN 0201192462
Ein starker Verfechter evolutionärer Lieferstrategien – kleine Versionen, stän-
diges Refactoring, intensiver Dialog mit dem Kunden.
Ivar Jacobson, Object-Oriented Software Engineering: A Case Driven Approach , Addi-
son-Wesley, 1992; ISBN 0201544350
Meine Quelle für das Konzept, die Entwicklung durch Storycards zu steuern.
Ivar Jacobson, Grady Booch, James Rumbaugh, The Unified Software Development
Process, Addison Wesley Longman, 1999; ISBN 0201571692
Von der Philosophie her stimme ich mit vielem in diesem Buch überein –
kurze Versionszyklen, Schwerpunkt auf Metaphern und Einsatz von Story-
cards zur Steuerung der Entwicklung.
Philip Metzger, Managing a Programming Project , Prentice-Hall, 1973; ISBN
0135507561 (dt.: Philip Metzger: Software-Projekte. Planung, Durchf ührung,
Kontrolle. Hanser 1977)
Der früheste Text zum Thema Projektmanagement des Programmierens, den
ich finden konnte. Er enth ält einige Sch ätze, aber die Perspektive ist reiner
Taylorismus. Von 200 Seiten sind genau zwei S ätze der Wartung gewidmet –
das Gegenteil von XP.
Jennifer Stapleton, DSDM Dynamic Systems Development Method: The Method in
Practice, Addison-Wesley, 1997; ISBN 0201178893
DSDM ist eine Methode, wie man die schnelle Anwendungsentwicklung
(RAD) unter Kontrolle bekommen kann, ohne auf ihre Vorteile zu verzichten.
--- PAGE 194 ---
174 A Kommentierte Bibliografie
Hirotaka Takeuchi und Ikujiro Nonaka, »The new product development game «,
Harvard Business Review [1986], 86116:137-146
Ein konsensorientierter Ansatz zur evolution ären Auslieferung. Enthält inter-
essante Ideen dazu, wie man XP auf Teams mit mehr Programmierern abstim-
men kann.
Jane Wood und Denise Silver, Joint Application Development , John Wiley and
Sons, 1995; ISBN 0471042994
Die so genannten »JAD Faciliators« und die XP-Coachs haben ein gemeinsa-
mes Wertesystem – unterst ützen, ohne zu dirigieren; den Leuten Macht
geben, die am ehesten wissen, wie man Entscheidungen f ällt, und sich selbst
schließlich zur ückziehen. JAD konzentriert sich auf die Erstellung eines
Anforderungsdokuments, bei dem Programmierer und Kunden darin überein-
stimmen, dass es sich implementieren lässt und dass es implementiert werden
soll.
Programmierung
Kent Beck, Smalltalk Best Practice Patterns, Prentice-Hall, 1996; ISBN 013476904X
Bescheidenheit verbietet jeden Kommentar.
Kent Beck und Erich Gamma, »Test Infected: Programmers Love Writing Tests «,
in Java Report, Juli 1998, Volume 3, Nummer 7, Seite 37-57
Wie man automatisierte Tests mit Junit, der Java-Version des Test-Frameworks
xUnit, schreibt.
John Bentley, Writing Effecient Programs, Prentice-Hall, 1982; ISBN 013970251-2
Heilmittel, wenn man befürchtet, nicht schnell genug zu sein.
Edward Dijkstra, A Discipline of Programming , Prentice-Hall, 1976; ISBN
013215871X
Programmieren als Mathematik. Mich hat besonders der Gedanke inspiriert,
dass die Programmierung vor allem durch das Streben nach Schönheit geleitet
wird.
Martin Fowler, Analysis Patterns , Addison Wesley Longman, 1996; ISBN
0201895420 (dt.: Martin Fowler, Analysemuster, Addison-Wesley 1999, ISBN 3-
8273-1434-8)
Ein allgemeines Vokabular für Analyseentscheidungen. Schwieriger zu verste-
hen als Designmuster, aber in vielerlei Hinsicht tiefschürfender, da die Analy-
semuster damit in Verbindung stehen, was im Unternehmen vor sich geht.
--- PAGE 195 ---
 Sonstiges 175
Erich Gamma, Richards Helms, Ralph Johnson, John Vlissides, Design Patterns:
Elements of Reusable Object-Oriented Software , Addison-Wesley, 1995; ISBN
0201633612 (dt.: dieselben, Entwurfsmuster. Elemente wiederverwendbarer, objekt-
orientierter Software, Addison-Wesley 1996, ISBN 3-89319-950-0)
Ein allgemeines Vokabular für Designentscheidungen.
Donald E. Knuth, Literate Programming , Stanford University, 1992; ISBN
0937073814
Eine kommunikationsorientierte Programmiermethode. Die Pflege nach die-
ser Methode geschriebener Programme ist sehr aufw ändig, da sie gegen das
Prinzip verstößt, dass man mit leichtem Gep äck reisen soll. Trotzdem sollte
jeder Programmierer von Zeit zu Zeit einmal nach dieser Methode program-
mieren, um sich daran zu erinnern, wie viel es zu kommunizieren gibt.
Steve McConnell, Code Complete: A Practical Handbook of Software Construction ,
Microsoft Press, 1993; ISBN 1556154844
Eine Studie dazu, wie viel Sorgfalt man profitabel in die Programmierung
investieren kann.
Bertrand Meyer, Object-Oriented Software Construction , Prentice-Hall, 1997; ISBN
0136291554 (dt.: Bertrand Meyer: Objektorientierte Softwareentwicklung. Han-
ser 1990, 3-446-15773-5)
Design nach Vertrag ist eine Alternative oder Erweiterung f ür bzw. von Kom-
ponententests.
Sonstiges
Barry Boehm, Software Engineering Economics , Prentice-Hall, 1981; ISBN
0138221227 (dt.: Barry Boehm: Software-Produktion. Forkel 1986, 3-7719-6301-
X)
Das Standardreferenzwerk f ür Überlegungen, wie viel Software kostet und
warum.
Larry Gonick und Mark Wheelis, The Cartoon Guide to Genetics , HarperPerennial
Library, 1991; ISBN 0062730991
Eine Demonstration der Bedeutung von Zeichnungen als Kommunikations-
mittel.
John Hull, Options, Futures, and Other Derivatives , Prentice-Hall, 1997; ISBN
0132643677
Die Standardreferenz für die Bestimmung der Preise von Optionen.
--- PAGE 196 ---
176 A Kommentierte Bibliografie
Edward Tufte, The Visual Display of Quantative Information , Graphics Press, 1992;
ISBN 096139210X
Weitere Techniken zur Kommunikation numerischer Informationen über Bil-
der. Erläutert beispielweise gut, wie man am besten Diagramme mit Messda-
ten präsentiert. Das Buch ist zudem sehr schön gemacht.
--- PAGE 197 ---
B Glossar
Soweit möglich, verwendet XP allgemein übliches Vokabular. Wo sich die Konzepte
von XP merklich von anderen Konzepten unterscheiden, verwenden wir neue Be-
griffe. Im Folgenden sind die wichtigsten Begriffe des XP-Lexikons aufgeführt.
AAAAuuuuttttoooommmmaaaattttiiiissssiiiieeeerrrrtttteeeer r r r 
TTTTeeeesssstttt
Ein Testfall, der ohne menschliches Zutun ausgeführt wird. Der Test über-
prüft, ob das System die erwarteten Werte berechnet.
BBBBeeeellllaaaassssttttuuuunnnnggggssssffffaaaakkkkttttoooorrrr Das gemessene Verhältnis zwischen idealer Entwicklungszeit und Kalen-
derzeit. Hat typischerweise einen Wert zwischen 2 und 4. (Anm. d. Übers.: 
Begriff wird mittlerweise nicht mehr verwendet.)
CCCCooooaaaacccchhhh Eine Rolle im Team, die jemand einnimmt, der den Prozess als Ganzes 
beobachtet und das Team auf potenzielle Probleme oder Verbesserungs-
möglichkeiten aufmerksam macht.
EEEEnnnnttttrrrrooooppppiiiieeee Die Tendenz eines Systems, mit der Zeit fehleranfälliger zu werden, und 
die Tendenz von Änderungen, teurer zu werden.
EEEEnnnnttttwwwwiiiicccckkkklllluuuunnnnggggssssaaaauuuuffff----
ggggaaaabbbbeeee
Etwas, von dem der Programmierer weiß, dass es das System leisten muss. 
Aufgaben müssen sich zwischen ein und drei Tagen idealer Entwicklungs-
zeit einschätzen lassen. Die meisten Aufgaben werden direkt von Lei-
stungsmerkmalen abgeleitet.
EEEErrrrffffoooorrrrsssscccchhhhuuuunnnngggg Eine Entwicklungsphase, in der der Kunde deutlich macht, was das 
System als Einheit tun könnte.
FFFFuuuunnnnkkkkttttiiiioooonnnnsssstttteeeesssstttt Ein Test, der aus der Perspektive des Kunden geschrieben wird. (Anm. d. 
Übers.: Der Begriff Funktionstest wurde mittlerweile durch den des Akzep-
tanztests ersetzt.)
IIIIddddeeeeaaaalllle e e e 
EEEEnnnnttttwwwwiiiicccckkkklllluuuunnnnggggsssszzzzeeeeiiiitttt
Die Maßeinheit einer Aufwandsschätzung, bei der man sich fragt: »Wie 
lange wird dies dauern, wenn es keine Unterbrechungen und Katastro-
phen gibt?«
IIIItttteeeerrrraaaattttiiiioooonnnn Eine ein- bis vierwöchige Periode. Zu Beginn wählt der Kunde die Leis-
tungsmerkmale aus, die in der ersten Iteration implementiert werden sol-
len. Am Ende kann der Kunde seine Funktionstests ausführen, um zu 
bestimmen, ob die Iteration erfolgreich war.
IIIItttteeeerrrraaaattttiiiioooonnnnssssppppllllaaaannnn Ein Stapel mit Storycards (Leistungsmerkmalen) und ein Stapel mit Task-
cards (Aufgaben). Programmierer verpflichten sich dazu, Aufgaben zu 
übernehmen und schätzen den nötigen Aufwand ein.
KKKKoooommmmppppoooonnnneeeennnntttteeeennnntttteeeesssstttt Ein Test, der aus der Perspektive der Programmierer geschrieben wird.
KKKKuuuunnnnddddeeee Eine Rolle im Team. Jemand entscheidet, welche Leistungsmerkmale das 
System aufweisen muss, welche Leistungsmerkmale zuerst gebraucht wer-
den und welche aufgeschoben werden können, und definiert die Tests, mit 
denen das korrekte Funktionieren der Storycards verifiziert werden kann.
--- PAGE 198 ---
178 B Glossar
MMMMaaaannnnaaaaggggeeeerrrr Eine Rolle im Team, die jemand einnimmt, der Ressourcen zuweist.
NNNNeeeeuuuueeeeiiiinnnnsssscccchhhhäääättttzzzzuuuunnnngggg Eine Planungsmaßnahme, bei der das Team alle noch für eine Version zu 
erledigenden Leistungsmerkmale neu einschätzt.
PPPPaaaarrrrttttnnnneeeerrrr Die andere Person, die mit Ihnen zusammen programmiert.
PPPPllllaaaannnnkkkkoooorrrrrrrreeeekkkkttttuuuurrrr Eine Planungsmaßnahme, durch die der Kunde am Fertigstellungsdatum 
einer Version festhalten kann, indem er wegen höherer Aufwandsschät-
zungen oder einer geringeren Arbeitsgeschwindigkeit des Teams den 
Umfang der Version reduziert.
PPPPllllaaaannnnuuuunnnnggggssssssssppppiiiieeeellll Das XP-Planungsverfahren. Die Geschäftsseite darf festlegen, was das 
System leisten muss. Die Entwicklung legt fest, wie viel jedes Leistungs-
merkmal kostet und welches Budget pro Tag/Woche/Monat zur Verfü-
gung steht.
PPPPrrrroooodddduuuukkkkttttiiiioooonnnn Die Entwicklungsphase, während der der Kunde tatsächlich Geld mit dem 
System verdient.
PPPPrrrrooooggggrrrraaaammmmmmmmiiiieeeerrrreeeen n n n 
iiiin n n n PPPPaaaaaaaarrrreeeennnn
Eine Programmierweise, bei der zwei Personen mit einer Tastatur, einer 
Maus und einem Bildschirm programmieren. In XP ändern sich die Paare 
typischerweise mehrmals täglich.
PPPPrrrrooooggggrrrraaaammmmmmmmiiiieeeerrrreeeerrrr Eine Rolle im Team für jemanden, der analysiert, ein Design entwirft, 
testet, programmiert und integriert.
RRRReeeeffffaaaaccccttttoooorrrriiiinnnngggg Eine Änderung am System, die dessen Verhalten unverändert lässt, aber 
eine nichtfunktionale Qualität verbessert – Einfachheit, Flexibilität, Ver-
ständlichkeit, Leistungsverhalten.
SSSSttttoooorrrryyyyccccaaaarrrrdddd Beschreibt ein vom Kunden gewünschtes Leistungsmerkmal des Systems. 
Storycards sollten zwischen ein und fünf Wochen idealer Programmierzeit 
einschätzbar sein und getestet werden können.
SSSSyyyysssstttteeeemmmmmmmmeeeettttaaaapppphhhheeeerrrr Eine Geschichte, mit der jeder – Kunde, Programmierer, Manager – die 
Funktionsweise des Systems veranschaulichen kann.
TTTTaaaasssskkkkccccaaaarrrrdddd Beschreibt eine Entwicklungsaufgabe.
TTTTeeeeaaaammmm----
ggggeeeesssscccchhhhwwwwiiiinnnnddddiiiiggggkkkkeeeeiiiitttt
Die Anzahl von Wochen idealer Programmierzeit, die das Team in einem 
bestimmten Zeitraum produzieren kann.
TTTTeeeerrrrmmmmiiiinnnnmmmmaaaannnnaaaaggggeeeerrrr
((((ttttrrrraaaacccckkkkeeeerrrr))))
Eine Rolle im Team, die den Arbeitsfortschritt mithilfe von Daten misst.
TTTTeeeessssttttffffaaaallllllll Eine automatisierte Menge von Reizen und Reaktionen für das System. 
Jeder Testfall sollte das System so hinterlassen, wie er es vorgefunden hat, 
sodass sich Tests unabhängig voneinander ausführen lassen.
VVVVeeeerrrrppppfffflilililicccchhhhtttteeeennnnddddeeeer r r r 
TTTTeeeerrrrmmmmiiiinnnnppppllllaaaannnn
Eine Version und ein Datum. Der verpflichtende Terminplan wird mit 
jeder Iteration weiter verfeinert und durch erneute Aufwandsschätzungen 
und Korrekturen modifiziert.
VVVVeeeerrrrssssiiiioooonnnn Ein Stapel von Storycards (Leistungsmerkmalen), die zusammengenom-
men ein geschäftliches Erfordernis erfüllen.
--- PAGE 199 ---
Stichwortverzeichnis
20:80-Regel   149
A
Abschlussbonus   162
Änderungen
Designstrategie   104, 105, 111, 112
Einfluss auf Softwareentwicklung   3, 4
entwerfen mithilfe von Bildern   111, 
112
Grundprinzip der inkrementellen Ä.
   
38
Grundprinzip des Begrüßens von Ä.
   38
Kosten   21, 22, 23, 24, 25
Managementstrategie   71
Outsourcing   160
Arbeitsumgebung
Anforderungen von XP   78, 79, 128, 
157
Einfluss auf Produktivität
   77
neu anordnen   78, 79, 123, 128
neu Bedeutung in XP   123
Arbeitszeit
40-Stunden-Woche   60, 61
Rechtfertigung der 40-Stunden-Woche   
68
XP-Verfahren
   54, 60, 61
Architektur
Designstrategie   113
Erforschungsphase   131, 132
Iterationen   134
System-   113
Aufgaben
Aufwand einschätzen   92
Definition   177
Verantwortung übernehmen für   92
Aufwandseinschätzung   55
Erforschungsphase   90, 131, 132
ideale Entwicklungszeit   93
Iterationsplanung   92, 93
Plankorrektur in der Steuerungsphase   
91, 94
Planungsstrategie   90, 91
Rolle des Protokollführers   74, 75
vergleichen mit Realaufwand   74, 75
Verpflichtungsphase   93
Automatisierte Tests   177
siehe Tests
B
Belastungsfaktor   177
Berater   146, 147
Bibliografie   167
Boss   147, 148
C
Cashflow   11, 12
Coach   145
Code
als Kommunikationsmittel   44, 45
D
Design
anpassen an XP
   127
Bedeutung in XP   57
grafisch darstellen   111, 112
Rechtfertigung der Einfachheit   65
XP-Verfahren   54, 57
Designstrategie   48, 103
Design als Kommunikationsmittel   109
Einfachheit   24, 103, 104, 106, 108, 
109
Einfluss der XP-Grundprinzipien
   104
Einfluss der XP-Prinzipien   111, 112
grafisch darstellen   112
grafische Darstellung   111, 112
Investitionen   110
kleine Anfangsinvestition   104
Kommunikation   103
Kosten   104, 105, 106
Kosten und Funktionalität   109, 110
Mut   103
Redundanzen entfernen   109
Refactoring   106, 107, 108
Risiken   105, 110
Rückmeldung   103
schlechtes Design   49
Systemarchitektur   113
Tests   24
verbessern   25
Vorteile guter Designs   49
XP-Werte   103
Dokumentation   156
E
Einfachheit
Bedeutung in XP
   30, 31
Designstrategie   108, 109
Grundprinzip   38
Kosten von Änderungen   30
--- PAGE 200 ---
180 Stichwortverzeichnis
E-Mail   72
Entropie   177
Entwicklungsstrategie
Fortwährende Integration   97, 98
Gemeinsame Verantwortlichkeit   99
Iterationsplanung   97
Paarprogrammierung   100, 101, 102
Überblick   97
XP anpassen   128
Entwicklungszyklus
Integration   9
Paarprogrammierung   7, 8, 9
Tests   9
Erforschungsphase
Architektur   131
Architektur testen   132
Aufwandseinschätzung   90, 131, 132
Definition   177
Länge   133
Leistungsmerkmale definieren   89
Rolle des Kunden   133
Spezialisten engagieren   132
Spielzüge   89
Storycards aufteilen   90
Storycards schreiben   89
Technologie testen   132
XP-Beispiel   131, 132
Zweck   89
Zweck in XP   131
F
Fehlerrate
Softwareentwicklung   3, 4
Tests   47
Festpreisverträge   159, 160
Fortwährende Integration
Bedeutung in XP   97
Kosten   98
Rechtfertigung   67
Refactoring   98
Risiken verringern durch   98
Vorteile   97, 98
XP-Verfahren   54, 60
Frameworks
entwickeln in XP-Projekten   163
entwickeln mit XP   163
Funktionstests   118
Definition   177
Funktionstests siehe Tests
G
Gemeinsame Verantwortlichkeit
Bedeutung in XP   54, 59, 99
Programmierer   142
Rechtfertigung   67
Vereinfachung des Codes   99
Vergleich mit anderen Modellen   59
Vorteile   99
Geschäftsbedingungen siehe Verträge
Geschäftsseite
Aufgaben   90
Kompetenzen   81, 82, 83
Liefertermine festlegen   55
Planungsstrategie   86, 88, 90
Prioritäten festlegen   55
Prioritäten von Leistungsmerkmalen 
festlegen   90
Umfang einer Version festlegen   90
Umfang festlegen   55
Verantwortlichkeiten   55, 81, 82, 83
Verhältnis zur Programmierern   81
Zusammenarbeit mit Entwicklern   55
Zusammensetzung von Versionen 
festlegen   55
Glossar   177
Grundprinzipien
Gutheißen von Änderungen   37, 38
Inkrementelle Änderung   37, 38
Qualitätsarbeit   37, 38
Schnelle Rückmeldung   37
Überblick   37
Voraussetzung von Einfachheit   37, 38
I
Ideale Entwicklungszeit
Aufwandseinschätzungen
   92
Definition   177
Insourcing   161
Integration
XP-Verfahren   54, 60
Integration siehe Fortwährende Integration
Integrationstests   9
Intervention   75
Personalwechsel   75
Projekt beenden   76
Teamprozess ändern   76
Investitionen
Designstrategie   104, 110, 111
Prinzip der kleinen Anfangsinvestition   
39
--- PAGE 201 ---
Stichwortverzeichnis 181
Iterationen
Architektur   134
Definition   177
Erforschungsphase   92
fortwährende Integration   97
Planungsprozess   91, 92, 93, 94, 95
Planungsspiel   94, 95
Planungsstrategie   91, 95, 96
Planungszeitraum   91
Steuerungsphase   93, 94
Tests   94
Verpflichtungsphase   92, 93
Version planen   94
XP-Beispiel   133, 134
Zwänge   95
Iterationsplanung
kleine Projekte   96
Plankorrektur   93
Steuerungsphase   93
Zwänge   95, 96
K
Klassen   107, 108
Kommunikation
Bedeutung in XP   29, 30
Designstrategie   103
Paarprogrammierung   101
Prinzip der offenen, ehrlichen K.   40
Programmcode als 
Kommunikationsmittel
   44, 45
Komponententests   118
Definition   177
Komponententests siehe Tests
Kosten
Designentscheidungen   110
Designstrategie   104, 105, 106
Projektmanagementstrategien   12
Variable in Softwareentwicklung   15, 
16, 17
Zwänge   16, 17
Kosten siehe Kosten von Änderungen
Kosten von Änderungen
Einfachheit und   30
Entscheidungsfindungsprozess   25
exponenzieller Anstieg   21, 105
gering halten   23, 25, 105, 109
Kunden   142, 143
Definition   177
einbinden ins Team   61, 62, 63
Entscheidungsfindungsprozess   143
erforderliche Fähigkeiten   142, 143
Funktionstests definieren   143
Metapher anerkennen   64
Rechtfertigung des Vor-Ort-Einsatzes   
68, 69
Rolle im Planungsspiel   63
Rolle im Team   61, 62
Rolle in XP   142, 143
Storycards schreiben   143
Tests definieren   117, 118
Umstellung auf XP   127
vor Ort   54, 61
XP-Verfahren   54, 61, 62
L
Lernen
durch Rückmeldungen
   37
lehren   39
programmieren   44
testen   46
M
Management
anpassen an XP
   128, 129
Strategien   71
Trainerrolle   73, 74
Managementstrategie   71
Bedeutung von Messdaten   72, 73
inkrementelle Änderungen   71
Intervention   75, 76
Prinzipien   71, 72
Protokollieren   74, 75
Trainerrolle   73, 74
Zentralisierung und Dezentralisierung   
71
Manager
Definition   178
Messdaten
als Managementtool   72, 73
Prinzip der ehrlichen M.   42, 72, 73
Metapher
Bedeutung in XP   56
Definition   178
Rechtfertigung des Gebrauchs von   64
XP-Verfahren   53, 56
Mut
Bedeutung in XP   33, 34
Code wegwerfen   33
Designstrategie   103
fördern   34
Kunden   142
Mängel beheben   33
Manager   147
Programmierer   142
--- PAGE 202 ---
182 Stichwortverzeichnis
N
Neueinschätzung
Definition   178
O
Objektorientierung
   24
Ökonomie, Softwareentwicklung   11
Cashflow   11
Faktoren   11, 12, 13
Optionen   12
Projektmanagementstrategien   12
Strategie   11
Outsourcing   160
P
Paarprogrammierung
Arbeitsweise
   100
Bedeutung in XP   58, 59, 100, 101, 
102
Beispiel
   7
Einfluss auf Aufwandseinschätzung   93
Gründe für deren Einsatz   66, 67
persönliche Konflikte   101
Produktivität   101
Qualität   101
Rechtfertigung   66, 67
Teamgeist   101
XP-Verfahren   54, 58, 59
Personalwechsel   3, 4
Plankorrektur
Definition   178
Planungsspiel
Protokollführer   75
Spielzüge   89
Bedeutung in XP   54
Bedeutung von Messdaten   72
Definition   178
Erforschungsphase   89
geschäftliche Entscheidungen   55
kurze Versionszyklen   64
Rechtfertigung seiner Einfachheit   63, 
64
Regeln
   87
Rolle der Entwickler   55
Rolle der Geschäftsseite   55, 86, 88, 
89, 90
Rolle der Kunden   63
Steuerungsphase   89, 91
Storycards   88
Strategie   87
technische Entscheidungen   55
technische und geschäftliche 
Entscheidungen abwägen   54
Verhältnis zwischen Geschäftsseite und 
Entwicklung   86, 87, 88
Verpflichtungsphase   89, 90
XP-Verfahren   53, 54
Planungsstrategie
anpassen an XP   127
Geschäftsseite   88, 89
Iterationen   85, 91, 92, 93, 94, 95, 96
Planung unter Zeitdruck   96
Planungsspiel   86, 87, 88
Überblick   85
Verantwortung übernehmen   85
XP-Prinzipien   85, 86
Zweck des Planens   85
Prinzipien
An die konkreten Bedingungen 
anpassen
   41
Ehrliche Messdaten   42
Instinkte nutzen   40, 41
Kleine Anfangsinvestition   39
Konkrete Experimente   40
Lernen lehren   39
Mit leichtem Gepäck reisen   42
Offene, ehrliche Kommunikation   40
Spielen, um zu gewinnen   39
Überblick   38
Verantwortung übernehmen   41
Prioritäten
festlegen   55
geschäftliche   53
Produktion
Definition   178
XP-Beispiel   134, 135
Programmieren   44
alten und neuen Code 
zusammenführen
   126
Bedeutung von Tests   45, 46, 47
Grundlagen   43
Kommunikation   44, 45
Kosten von Änderungen   23, 24
Lernprozess   44
Mut   33
objektorientiert   24
Redundanzen vermeiden   109
Tests   45
Programmierer   140
Aufgabe implementieren   93
Aufgaben übernehmen   92
Aufwandseinschätzung   55
--- PAGE 203 ---
Stichwortverzeichnis 183
Aufwandseinschätzung für Aufgaben   
92
Bedeutung des Zuhörens   48
Belastungsfaktor festlegen   93
Definition   178
Entwicklungsgeschwindigkeit festlegen   
90
gemeinsame Verantwortlichkeit   142
Kommunikation   48
Konsequenzen von 
Geschäftsentscheidungen einschätzen
   
55
Mut
   142
Risiko von Leistungsmerkmalen 
festlegen
   90
Rolle im Planspiel   55
Rolle in XP   140, 141
Terminplanung   55
Tests definieren   117, 118
Umstellung auf XP   128, 129
Verantwortlichkeiten   55, 82, 83
Verhältnis zur Geschäftsseite   82, 83
Programmierstandards
Gründe für deren Einsatz   62, 66, 67, 
69
Refactoring
   66
XP-Verfahren   54, 62
Projektabbruch   3, 4
Projekte
beenden   137
Erforsuchungsphase   131, 132
in Produktion gehen   134, 135
Lebensdauer   11
XP übernehmen   123
Projektmanagement
Beispiel   13
Kostenzwänge   16, 17
Optionen   12
Optionen bewerten   12, 13
Projekt ändern   12
Projekt einstellen   12
Qualitätsanforderungen   18
Umfang als Variable   18, 19
Wert maximieren   12
Zeitzwänge   17
Protokollführer   144, 145
Rolle in XP   144, 145
Protokollieren
Bedeutung in XP   74, 75
Planspiel   75
Q
Qualität
Auswirkungen von Anforderungen   17, 
18
Grundprinzip   38
interne und externe   17
Variable in Softwareentwicklung   15, 
16, 17, 18
R
Refactoring
Bedeutung in XP
   58
Definition   178
Designstrategie   106, 107, 108
fortwährende Integration   98
Rechtfertigung   65
XP-Verfahren   54, 58
Risiken
Änderung der geschäftlichen 
Anforderungen   3, 4
Designstrategie   105, 110
Fehlerrate   3, 4
Missverständnisse   3, 4
Personalwechsel   3, 4
Projektabbruch   3, 4
Rentabilität   3, 4
Terminverzögerungen   3, 4
Überblick   3
unnötige Funktionen   3, 4
Rollen
Bedeutung in XP   139, 140
Berater   146, 147
Boss   147, 148
Kunde   142, 143
Programmierer   140, 141, 142
Protokollführer   144, 145
Tester   144
Trainer   73, 74, 145, 146
Rückmeldung
Bedeutung in XP   31, 32
Bewertung der Metapher   64
Designstrategie   103
frühe Produktion   16, 32
Grundprinzip der schnellen R.   37
sammeln durch grafisches Design   111, 
112
sammeln durch Tests
   31
Zeiträume   16, 31
--- PAGE 204 ---
184 Stichwortverzeichnis
S
Software
kommerzielle entwickeln mit XP   164
Softwareentwicklung
Änderungen der geschäftlichen 
Anforderungen   3, 4
Arbeitsschritte strukturieren   53
Beispielepisode   7
Design entwerfen   48
Fehlerrate   3, 4
grundlegende Arbeitsschritte   43, 44, 
45, 48
objektorientierte   24
Ökonomie   11
Personalwechsel   3, 4
Projektabbruch   3, 4
Rentabilität   3, 4
Risiken   3, 4
steuern   27
Terminverzögerungen   3, 4
Teststrategie   115, 117
unnötige Funktionen   3, 4
Variablen   15, 16, 17, 18, 19
wirtschaftliche Faktoren   11, 12, 13
Standards
Programmier-   54, 62
XP-Verfahren   54, 62
Steuerungsphase
Iterationen   91
Leistungsmerkmale hinzufügen   91
Plankorrektur   91
Zweck   91
Storycards
aufteilen   90
Definition   178
einschätzen   90
Planspiel   88
schreiben   89
T
Taskcards
Definition
   178
Teams
Geschwindigkeit   178
Rollen   139, 140, 141, 142, 143, 144, 
145, 146, 147
Technologie
Auswahl   83
Terminmanager   144
Terminplanung   55
Terminverzögerungen   3, 4
Tester   144
Rolle in XP   144
Testfälle
Definition   178
Tests   45
akzeptable Fehlerrate   47
anpassen an XP   126
automatisierte   45, 46, 116
Bedeutung für XP   115, 116, 117
Bedeutung in XP   45, 46, 47, 57, 58, 
65
Belastungstests
   119
Einfluss auf Projektlebensdauer   46
Funktionstests   45, 47, 57, 118
Idiotentest   119
Integrationstests   9
Komponententests   47, 57, 118
Kunden   117, 118
Lernprozess   46, 47
Paralleltests   119
programmieren   45, 47, 117
Programmierer   117, 118
Rechtfertigung ihres Einsatzes   65
Rückmeldungen erhalten durch   31
XP-Verfahren   54, 57
Zielgruppen   47
Teststrategie   115, 116, 117
Tests minimieren   118
Testtypen   118, 119
Trainer
Aufgaben   73, 74, 145, 146
Fertigkeiten   146
Rolle in XP   145, 146
Verantwortung   145
U
Umfang
Variable in Softwareentwicklung
   15, 
16, 18, 19
V
Variablen, Softwareentwicklung
Abhängigkeiten
   15, 16
Kosten   15, 16, 17
Qualität   16, 17, 18
Überblick   15
Umfang   16, 18, 19
Zeit   16, 17
Verantwortung
Entwicklungsteam   54, 59
Geschäftsseite   55
übernehmen statt zuweisen   85
übernehmen, nicht zuweisen   41
XP-Verfahren   54, 59
--- PAGE 205 ---
Stichwortverzeichnis 185
Verantwortung siehe Gemeinsame 
Verantwortlichkeit
Verpflichtender Terminplan   178
Verpflichtungsphase
Aufgaben einschätzen   93
Aufgaben übernehmen   92
Belastungsausgleich   93
Belastungsfaktor festlegen   93
Spielzüge   90
Zweck   90
Versionen
Definition   178
Rechtfertigung kurzer Zyklen   64
Umfang festlegen   55
XP-Verfahren   53, 56
Verträge   159
Abrechnung nach Aufwand   162
Abschlussbonus   162
fester Liefertermin   160
fester Umfang   159, 160
Festpreis   159
Insourcing   161
Outsourcing   160
Strafe bei Terminverzögerungen   162
vorzeitige Beendigung   163
W
Wartung
XP-Beispiel   135, 136
Werte
Einfachheit   30, 31
Kommunikation   29, 30
Mut   33
Rückmeldung   31, 32
Überblick   29
umsetzen in der Praxis   34, 35
X
XP
20
80-Regel
   149
anpassen an laufende Projekte   125, 
126, 127, 128, 129
Arbeitsumgebung   77
Designstrategie   103
Entwicklungsstrategie   97
Grenzen   155, 156, 157, 158
idealer Projektablauf   131
Managementstrategie   71
Planungsstrategie   85, 96
Rollen im Team   139, 140
Schwierigkeiten in der Praxis   151, 
152, 153, 154
Tests   57
Teststrategie   115, 116, 117
Überblick   xvii, xviii
übernehmen   123
Unterschiede zu anderen 
Methodologien
   xvii, xviii
Werte   29
XP-Grundprinzipien
Ehrliche Messdaten   42
Einfluss auf Designstrategie   104
Gutheißen von Änderungen   38
Inkrementelle Änderungen   38
Qualitätsarbeit   38
Schnelle Rückmeldung   37
Überblick   37
Voraussetzung von Einfachheit   38
XP-Praxis
Arbeitsumgebung   158
Design an XP anpassen   127
Entwicklung an XP anpassen   128, 129
Entwicklung von Frameworks   163
Entwicklung von kommerzieller 
Software
   164
Firmenkultur   155, 156
für XP ungeeignete Bedingungen   155, 
156, 157, 158
idealer Projektablauf   131, 132, 133, 
134, 135, 136, 137
in Produktion gehen   134, 135
Management an XP anpassen   128
Planung   133
Planung an XP anpassen   127
Projektende   137
Schwierigkeiten beim Einsatz von XP   
151, 152, 153, 154
Teamgröße   156, 157
technologische Grenzen   157
Tests an XP anpassen   126
Verträge   159, 160, 161, 162, 163
Wartung   135, 136
XP anpassen   125, 129
XP-Prinzipien
An die konkreten Bedingungen 
anpassen
   41
Instinkte nutzen   40, 41
Kleine Anfangsinvestition   39
Konkrete Experimente   40
Lernen lehren   39
Mit leichtem Gepäck reisen   42
--- PAGE 206 ---
186 Stichwortverzeichnis
Offene, ehrliche Kommunikation   40
Spielen, um zu gewinnen   39
Überblick   38
Verantwortung übernehmen   41
XP-Verfahren
40-Stunden-Woche   54, 60, 61
Einfaches Design   54, 57
Fortwährende Integration   54, 60, 97
Gemeinsame Verantwortlichkeit   54, 
59, 99
Kleine Versionen   53, 56
Kunde vor Ort   54, 61, 62
Metapher   53, 56
Paarprogrammierung   54, 58, 59, 100, 
101, 102
Planspiel   53, 54, 55
Programmierstandards   54, 62
Refactoring   54, 58
Testen   54, 57, 58
Überblick   53, 54
umsetzen   63
XP-Werte
Einfachheit   30, 31, 103
Kommunikation   29, 30, 103
Mut   33, 34, 103
Rückmeldung   31, 32, 103
Überblick   29
umsetzen in der Praxis   34, 35
Z
Zeit
Variable in Softwareentwicklung   15, 
16, 17
Ziele
Planspiel   87
Zinssätze   11
Zuhören
aktives   48
Bedeutung in XP   48
--- PAGE 207 ---
Copyright 
Daten, Texte, Design und Grafiken dieses eBooks, sowie die eventuell angebotenen 
eBook-Zusatzdaten sind urheberrechtlich geschützt. Dieses eBook stellen wir 
lediglich als persönliche Einzelplatz-Lizenz zur Verfügung! 
Jede andere Verwendung dieses eBooks oder zugehöriger Materialien und 
Informationen, einschliesslich 
•  der Reproduktion, 
•  der Weitergabe, 
•  des Weitervertriebs, 
•  der Platzierung im Internet, 
in Intranets, in Extranets, 
•  der Veränderung, 
•  des Weiterverkaufs 
•  und der Veröffentlichung 
bedarf der schriftlichen Genehmigung des Verlags. 
Insbesondere ist die Entfernung oder Änderung des vom Verlag vergebenen 
Passwortschutzes ausdrücklich untersagt! 
Bei Fragen zu diesem Thema wenden Sie sich bitte an: info@pearson.de
Zusatzdaten 
Möglicherweise liegt dem gedruckten Buch eine CD-ROM mit Zusatzdaten bei. Die 
Zurverfügungstellung dieser Daten auf unseren Websites ist eine freiwillige Leistung 
des Verlags. Der Rechtsweg ist ausgeschlossen. 
Hinweis 
Dieses und viele weitere eBooks können Sie rund um die Uhr 
und legal auf unserer Website 
 
http://www.informit.de
herunterladen 