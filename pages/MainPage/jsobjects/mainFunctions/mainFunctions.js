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
	addingNewRow: false,
	newRow: () => {
		this.addingNewRow = true;
		assistitiHospice_tbl.setSelectedRowIndex(null);
		struttura_erog_txt.setValue("830100");
		tariffa_giornaliera_txt.setValue("250");
	},
	verificaOAggiungiRiga: async () => {
		if (!this.verificaCampiObbligatori()) {
			if (assistitiHospice_tbl.selectedRow) {
				// AGGIORNA
				await this.modificaRiga();
				showAlert("Mofifica effettuata con successo", "info");
			}
			else { // AGGIUNGI
				await this.aggiungiRiga();
				showAlert("Aggiunta effettuata con successo", "info");
			}
			this.aggiornaDatiAssistiti();
		}
	},
	getDatiRowSelezionata: (newID = null) => {
		let data = {
			"ID": newID ?? assistitiHospice_tbl.selectedRow["ID"],
			"Cognome": cognome_txt.text,
			"Nome": nome_txt.text,
			"Trasmissione": "I",
			"CodiceUnivoco": cf_txt.text,
			"AnnoNascita": annoNascita_txt.text,
			"Genere": genere_cmb.selectedOptionValue,
			"Cittadinanza":  cittadinanza_txt.text,
			"TitoloStudio": titoloStudio_cmb.selectedOptionValue,
			"RegioneR": regioneResidenza_txt.text,
			"ASLR": aslResidenza_txt.text,
			"Comune":  "_"+comune_res_txt.text,
			"StatoEstero": statoestero_txt.text,
			"StrutturaErogatrice": struttura_erog_txt.text,
			"DataRicovero": moment(data_ricovero.selectedDate).format("YYYY-MM-DD"),
			"TrasmissioneT2": "I",
			"TariffaGiornaliera": tariffa_giornaliera_txt.text,
			"TipoStrutturaProvenienza": tipoStrutturaProv_cmb.selectedOptionValue,
			"DataRichiestaRicovero": moment(data_richiesta_ricovero_cmb.selectedDate).format("YYYY-MM-DD"),
			"DataRicezioneRichiestaRicovero":  moment(data_ric_ric_cmb.selectedDate).format("YYYY-MM-DD"),
			"PatologiaResponsabile": patologia_resp_txt.text,
			"MotivoPrevalenteRicovero": motivo_prev_ricovero.selectedOptionValue,
			"SS1": "_"+ss1_txt.text,
			"SS2": ss2_txt.text !== "" && ss2_txt.isValid ? ("_"+ss2_txt.text) : "_XXXXXX",
			"MNC1": mnc1_txt.text !== "" && mnc1_txt.isValid ? ("_"+ mnc1_txt.text) : "_XXXXXX",
			"MNC2": mnc2_txt.text !== "" && mnc2_txt.isValid ? ("_"+ mnc2_txt.text) : "_XXXXXX",
			"SSP1": "_" +ssp1_txt.text,
			"SSP2": "_" + ssp2_txt.text,
			"SSS1": sss1_txt.text !== "" && sss1_txt.isValid ? ("_" + ssp1_txt.text) : "_XXXXXX",
			"SSS2": sss2_txt.text !== "" && sss2_txt.isValid ? ("_" + ssp2_txt.text) : "_XXXXXX",
			"Macroprestazioni1": mp1_ch.isChecked ? "TRUE": "FALSE",
			"Macroprestazioni2": mp2_ch.isChecked ? "TRUE": "FALSE",
			"Macroprestazioni3": mp3_ch.isChecked ? "TRUE": "FALSE",
			"Macroprestazioni4": mp4_ch.isChecked ? "TRUE": "FALSE",
			"Macroprestazioni5": mp4_ch.isChecked ? "TRUE": "FALSE",
			"Macroprestazioni6": mp6_ch.isChecked ? "TRUE": "FALSE",
			"Macroprestazioni7": mp7_ch.isChecked ? "TRUE": "FALSE",
			"Macroprestazioni8": mp8_ch.isChecked ? "TRUE": "FALSE",
			"Macroprestazioni9": mp9_ch.isChecked ? "TRUE": "FALSE",
			"Macroprestazioni10": mp10_ch.isChecked ? "TRUE": "FALSE",
			"DataDimissione":  moment(data_dimissioni.selectedDate).format("YYYY-MM-DD"),
			"Modalità": tipologia_dimissioni_cmb.selectedOptionValue
		};
		if (assistitiHospice_tbl.selectedRow.rowIndex)
			data["rowIndex"] = assistitiHospice_tbl.selectedRow.rowIndex;
		return data;
	},
	modificaRiga: async () => {
		if (!this.verificaCampiObbligatori()) {
			await modificaRigaDB.run({data: this.getDatiRowSelezionata()});
		}
	},
	aggiungiRiga: async () => {
		if (!this.verificaCampiObbligatori()) {
			await getMaxID.run();
			const maxId = getMaxID.data[0]['ID'];
			await addNewRigaDB.run({data: this.getDatiRowSelezionata(maxId+1)});
			aggiungiModifica.setDisabled(true);
		}
		else 
			showAlert("Errore: verifica i campi non validi","error");

	},
	verificaCampiObbligatori: () => {
		return cf_txt.text == "" || !cf_txt.isValid ||
			cognome_txt.text == "" ||
			nome_txt.text == "" || 
			annoNascita_txt.text == "" || !annoNascita_txt.isValid ||
			!genere_cmb.isValid ||
			cittadinanza_txt.text == "" || !cittadinanza_txt.isValid ||
			regioneResidenza_txt.text == "" || !regioneResidenza_txt.isValid ||
			aslResidenza_txt.text == "" || !aslResidenza_txt.isValid ||
			!titoloStudio_cmb.isValid ||
			statoestero_txt.text == "" || !statoestero_txt.isValid ||
			comune_res_txt.text == "" || !comune_res_txt.isValid ||
			struttura_erog_txt.text == "" || !struttura_erog_txt.isValid ||
			data_richiesta_ricovero_cmb.selectedDate == "" ||
			data_ric_ric_cmb.selectedDate == "" ||
			data_ricovero.selectedDate == "" ||
			!motivo_prev_ricovero.isValid ||
			tariffa_giornaliera_txt.text == "" || !tariffa_giornaliera_txt.isValid
			!tipoStrutturaProv_cmb.isValid ||
			patologia_resp_txt.text == "" || !patologia_resp_txt.isValid ||
			ss1_txt.text == "" || !ss1_txt.isValid ||
			ssp1_txt.text == "" || !ssp1_txt.isValid ||
			ssp2_txt.text == "" || !ssp2_txt.isValid ||
			(!mp1_ch.isChecked && !mp2_ch.isChecked && !mp3_ch.isChecked && !mp4_ch.isChecked && !mp5_ch.isChecked && !mp6_ch.isChecked && !mp7_ch.isChecked && !mp8_ch.isChecked && !mp9_ch.isChecked ) ||
			data_dimissioni.selectedDate == "" || 
			!tipologia_dimissioni_cmb.isValid;
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
	async aggiornaDatiAssistiti () {
		// from: {{ annoCmb.selectedOptionValue.toString() + trimestreCmb.selectedOptionValue.split("|")[0]}}
		// to: {{ annoCmb.selectedOptionValue.toString() + trimestreCmb.selectedOptionValue.split("|")[1]}}
		let params = {from: moment(data_da.selectedDate).subtract(1, 'years').format("YYYY-MM-DD")};
		if (data_a.selectedDate !== "")
			params.to = moment(data_a.selectedDate).format("YYYY-MM-DD");
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