export default {
	regione: "190",
	asp: "205",
	struttura: "830100",
	generaT1(filename = this.regione + this.asp + "_" + this.struttura + "_" + annoCmb.selectedOptionValue.toString() + "_0" + trimestreCmb.selectedOptionLabel.substr(0,1) + "_PIC_al_" + 
				moment().format("YYYY_MM_DD")) {
		try {
			// Verifica che fast_xml_parser sia disponibile
			if (typeof fast_xml_parser === 'undefined' || typeof fast_xml_parser.XMLBuilder !== 'function') {
				return "Errore: fast_xml_parser non è disponibile o non contiene XMLBuilder";
			}

			let Assistenza = [];
			for (let riga of getDataByRange.data) {
				const dataRicovero = moment(riga['DataRicovero']).format("YYYY-MM-DD");
				let temp = {
					Trasmissione: {
						"@_tipo": "I"
					},
					Assistito: {
						DatiAnagrafici: {
							CUNI: riga['CodiceUnivoco'],
							validitaCI: "0",
							tipologiaCI: "0",
							AnnoNascita: riga["AnnoNascita"],
							Genere: riga['Genere'],
							Cittadinanza: riga['Cittadinanza'],
							TitoloStudio: riga['TitoloStudio'],
							Residenza: {
								Regione: riga['RegioneR'],
								ASL: riga['ASLR'],
								Comune: this.removeChar(riga['Comune'],"_"),
								StatoEstero: riga['StatoEstero']
							},
						},
					},
					PresaInCarico: {
						Regione: riga['RegioneR'].toString(),
						ASL: riga['ASLR'].toString(),
						StrutturaErogatrice: riga['StrutturaErogatrice'].toString(),
						DataRicovero: dataRicovero.toString(),
						Id_Rec: riga['RegioneR'].toString() + riga['ASLR'].toString() + riga['StrutturaErogatrice'].toString() + dataRicovero.toString() + riga['CodiceUnivoco'],
					}

				};
				Assistenza.push(temp);
			}

			// Definisci l'oggetto XML direttamente con l'array di assistenze
			const xmlObj = {
				HspPresaInCarico: {
					"@_xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
					Assistenza: Assistenza
				}
			};

			// Configura il builder con opzioni
			const builder = new fast_xml_parser.XMLBuilder({
				ignoreAttributes: false,
				format: true,
				indentBy: "    ",
				suppressEmptyNode: false,
				attributeNamePrefix: "@_"
			});

			// Genera XML
			const xml = '<?xml version="1.0" encoding="UTF-8"?>\n' + builder.build(xmlObj);

			// Scarica il file
			download(xml, filename, "application/xml");
			return "Download avviato!";
		} catch (error) {
			return "Errore: " + error.message;
		}
	},
	generaT2(filename = this.regione + this.asp + "_" + this.struttura + "_" + annoCmb.selectedOptionValue.toString() + "_0" + trimestreCmb.selectedOptionLabel.substr(0,1) + "_ATT_al_" + 
				moment().format("YYYY_MM_DD")) {
		try {
			// Verifica che fast_xml_parser sia disponibile
			if (typeof fast_xml_parser === 'undefined' || typeof fast_xml_parser.XMLBuilder !== 'function') {
				return "Errore: fast_xml_parser non è disponibile o non contiene XMLBuilder";
			}

			let Assistenza = [];
			getDataByRange.clear();
			for (let riga of getDataByRange.data) {
				const dataRicovero = moment(riga['DataRicovero']).format("YYYY-MM-DD");
				const dataRichiestaRicovero =moment(riga['DataRichiestaRicovero']).format("YYYY-MM-DD");
				const dataRicezioneRichiestaRicovero = moment(riga['DataRicezioneRichiestaRicovero']).format("YYYY-MM-DD");
				const dataDimissione = moment(riga['DataDimissione']).format("YYYY-MM-DD");

				let temp = {
					Trasmissione: {
						"@_tipo": "I"
					},
					PresaInCarico: {
						Regione: riga['RegioneR'],
						ASL: riga['ASLR'],
						StrutturaErogatrice: riga['StrutturaErogatrice'],
						DataRicovero: dataRicovero,
						Id_Rec: riga['RegioneR'].toString() + riga['ASLR'].toString() + riga['StrutturaErogatrice'].toString() + dataRicovero.toString() + riga['CodiceUnivoco'],
						TariffaGiornaliera: parseFloat((riga['TariffaGiornaliera'].toString())).toFixed(2),
						TipoStrutturaProvenienza: riga['TipoStrutturaProvenienza'],
						DataRichiestaRicovero: dataRichiestaRicovero,
						DataRicezioneRichiestaRicovero: dataRicezioneRichiestaRicovero,
						PatologiaResponsabile: riga['PatologiaResponsabile'],
						MotivoPrevalenteRicovero: riga['MotivoPrevalenteRicovero'],
						SS1: this.removeChar(riga['SS1'],"_"),
						SS2:  this.removeChar(riga['SS2'],"_"),
						MNC1:  this.removeChar(riga['MNC1'],"_"),
						MNC2:  this.removeChar(riga['MNC2'],"_"),
					},
					Erogazione: {
						SSP1:  this.removeChar(riga['SSP1'],"_"),
						SSP2:  this.removeChar(riga['SSP2'],"_"),
						SSS1:  this.removeChar(riga['SSS1'],"_"),
						SSS2:  this.removeChar(riga['SSS2'],"_"),
						Macroprestazioni: this.getMacroprestazioniArrayRiga(riga)
					},
					Conclusione: {
						DataDimissione: dataDimissione,
						Modalita: riga['Modalità']
					}
				};
				Assistenza.push(temp);
			}

			// Definisci l'oggetto XML direttamente con l'array di assistenze
			const xmlObj = {
				HspAttivita: {
					"@_xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
					Assistenza: Assistenza
				}
			};

			// Configura il builder con opzioni
			const builder = new fast_xml_parser.XMLBuilder({
				ignoreAttributes: false,
				format: true,
				indentBy: "    ",
				suppressEmptyNode: false,
				attributeNamePrefix: "@_"
			});

			// Genera XML
			const xml = '<?xml version="1.0" encoding="UTF-8"?>\n' + builder.build(xmlObj);

			// Scarica il file
			download(xml, filename, "application/xml");
			return "Download avviato!";
		} catch (error) {
			return "Errore: " + error.message;
		}
	},
	getMacroprestazioniArrayRiga (riga) {
		let macroprestazioni = [];
		for (let i =1; i<11; i++)
			if (riga["Macroprestazioni" + i] === true)
				macroprestazioni.push(i === 10 ? 99 : i);
		return macroprestazioni;
	},
	removeChar(str, ch) {
		return str.toString().replace(ch,"");
	},
	onTextChanged(control) {
		// Converti il testo in maiuscolo
		const upperText = control.text ? control.text.toUpperCase() : "";
		// Aggiorna il valore solo se è cambiato
		// (per evitare loop infiniti)
		if (control.text !== upperText) {
			control.setValue(upperText)
		}

		return upperText;
	},
	aggiornaDatiAssistito : () => {
		//genere_cmb.setSelectedOption(assistitiHospice_tbl.selectedRow['Genere']);
		//console.log(assistitiHospice_tbl.selectedRow['Genere']);
	},
	unixToDate : (unixDate) => {
		const date = moment(unixDate);
		console.log(unixDate);
		//console.log(DatePicker1.formattedDate);
		return date.format("DD/MM/YYYY");
	}
}