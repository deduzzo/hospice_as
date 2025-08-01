export default {
	/* =======================
	   VARIABILI DI STATO
	======================= */
	livelli: {
		"100": "SuperAdmin",
		"1": "Utente",
		"2": "Admin Distretto",
		"3": "Amministratore"
	},
	firstLoadingOk: false,
	userData: null,
	distrettoCambiato: false,
	secret: "UxZ>69'[Tu<6",
	distrettiMap: { byUnique: {}, byId: {} },
	regione: "190",
	asp: "205",
	struttura: "830100",
	dataRange: {
		from:  moment().subtract(1, 'years').format("YYYY-MM-DD"),
		to: moment().format("YYYY-MM-DD"),
	},
	async initLoad() {
		this.firstLoadingOk = false;
		try {
			await this.getDistrettiMap();          // 1
			await this.verifyTokenExpires();       // 2
			await this.aggiornaDatiAssistiti();
		} catch (err) {
			console.error("Errore in initLoad:", err);
			showAlert("Si è verificato un errore nel caricamento iniziale", "error");
		} finally {
			this.firstLoadingOk = true;
		}
	},
	async aggiornaDatiAssistiti (from = moment().subtract(1, 'years').format("YYYY-MM-DD") , to = null) {
		// from: {{ annoCmb.selectedOptionValue.toString() + trimestreCmb.selectedOptionValue.split("|")[0]}}
		// to: {{ annoCmb.selectedOptionValue.toString() + trimestreCmb.selectedOptionValue.split("|")[1]}}
		let params = {from: from};
		if (to)
			params.to = to;
		await getDataByRange.run(params);
	},

	async generaT1 (filename = this.regione + this.asp + "_" + this.struttura + "_" + annoCmb.selectedOptionValue.toString() + "_0" + trimestreCmb.selectedOptionLabel.substr(0,1) + "_PIC_al_" + 
					 moment().format("YYYY_MM_DD")) {
		try {
			const filtriCf = filtroCf_txt.text ? filtroCf_txt.text.split(",") : null;
			// Verifica che fast_xml_parser sia disponibile
			if (typeof fast_xml_parser === 'undefined' || typeof fast_xml_parser.XMLBuilder !== 'function') {
				return "Errore: fast_xml_parser non è disponibile o non contiene XMLBuilder";
			}
await getDataByRange.clear();
			await getDataByRange.run(this.getFromToAnnoTrimestre(trimestreCmb.selectedOptionValue,annoCmb.selectedOptionValue));
			let Assistenza = [];
			for (let riga of getDataByRange.data) {
				if (!filtriCf || (filtriCf.includes(riga['CodiceUnivoco'].toUpperCase()))) {
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
	async generaT2(filename = this.regione + this.asp + "_" + this.struttura + "_" + annoCmb.selectedOptionValue.toString() + "_0" + trimestreCmb.selectedOptionLabel.substr(0,1) + "_ATT_al_" + 
					 moment().format("YYYY_MM_DD")) {
		try {
			const filtriCf = filtroCf_txt.text ? filtroCf_txt.text.split(",") : null;
			// Verifica che fast_xml_parser sia disponibile
			if (typeof fast_xml_parser === 'undefined' || typeof fast_xml_parser.XMLBuilder !== 'function') {
				return "Errore: fast_xml_parser non è disponibile o non contiene XMLBuilder";
			}

			let Assistenza = [];
			await getDataByRange.clear();
await getDataByRange.run(this.getFromToAnnoTrimestre(trimestreCmb.selectedOptionValue,annoCmb.selectedOptionValue));
			for (let riga of getDataByRange.data) {
				if (!filtriCf || (filtriCf.includes(riga['CodiceUnivoco'].toUpperCase()))) {
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
		console.log(date.format("YYYY"));
		return date.format("YYYY-MM-DD");
	},
	/* =======================
	   TOKEN / SICUREZZA
	======================= */
	verifyTokenExpires() {
		let expired = false;

		if (appsmith.store.token) {
			try {
				const decoded = jsonwebtoken.verify(appsmith.store.token, this.secret);

				const distretti = this.getDistrettiFromIds(decoded.data.id_distretto);
				this.userData = {
					username: decoded.data.user,
					livelloText: this.livelli[decoded.data.livello.toString()],
					abilitazioni: decoded.data.abilitazioni_dipententi.split(','),
					livello: decoded.data.livello,
					mail: decoded.data.mail,
					distrettoRaw: decoded.data.id_distretto,
					// se non è stato cambiato distretto uso il primo, altrimenti mantengo quello selezionato
					codDistretto: this.distrettoCambiato
					? this.userData.codDistretto
					: parseInt(Object.keys(distretti)[0]),
					distretto: this.distrettoCambiato
					? this.userData.distretto
					: this.distrettiMap.byId[Object.keys(distretti)[0]].unique,
					distrettoTxt: this.distrettoCambiato
					? this.userData.distrettoTxt
					: distretti[Object.keys(distretti)[0]]
				};

				const newToken = this.createToken({ data: decoded.data });
				storeValue("token", newToken);
			} catch (err) {
				console.error("Token non valido o scaduto:", err);
				expired = true;
			}
		} else expired = true;

		if (expired) {
			this.doLogout("Sessione scaduta, effettua di nuovo il login", "warning");
		}
		return { expired };
	},
	
		doLogout: (msg = "Logout effettuato", type = "info") => {
		storeValue("token", null);
		storeValue("message", { msg, type });
		navigateTo("LoginPage");
	},

	createToken: user => jsonwebtoken.sign(user, this.secret, { expiresIn: 60 * 60 }),
	/* =======================
	   DISTRETTI UTENTE
	======================= */
	getDistrettiFromIds(distrettiString, separator = ",") {
		const ids = distrettiString.split(separator);
		return ids.reduce((acc, id) => {
			const d = this.distrettiMap.byUnique[id];
			if (d) acc[d.old_code] = d.descrizione;
			return acc;
		}, {});
	},

	async getDistrettiMap() {
		// se serve aggiornare il dataset, decommenta:
		// await getAllDistretti.run();
		const distretti = getAllDistretti.data || [];
		distretti.forEach(d => {
			this.distrettiMap.byUnique[d.unique] = d;
			this.distrettiMap.byId[d.old_code] = d;
		});
	},
	getFromToAnnoTrimestre(trimestre, anno = moment().year) {
		  const trim = [
				"-01-01|-03-31",
				"-04-01|-06-30",
				"-07-01|-10-31",
				"-11-01|-12-31"];
		return {
			from: anno+trim[trimestre-1].split("|")[0],
			to: anno + trim[trimestre-1].split("|")[1]
		};	
	}
}