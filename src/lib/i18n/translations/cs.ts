export const cs = {
  common: {
    appName: 'InnerBalance',
    loading: 'Načítání...',
    error: 'Došlo k chybě',
    save: 'Uložit',
    cancel: 'Zrušit',
    delete: 'Smazat',
    edit: 'Upravit',
  },
  navigation: {
    home: 'Domů',
    overview: 'Přehled',
    expenseHighlighter: 'Zvýrazňovač výdajů',
    financialGPS: 'Finanční GPS',
    ifsDialogue: 'IFS Dialog',
    selfCompassion: 'Sebesoucit',
  },
  landing: {
    hero: {
      title: 'Transformujte svůj vztah k penězům',
      subtitle: 'Objevte, jak porozumění vašim emočním vzorcům může vést k lepším finančním rozhodnutím a trvalé změně.',
      cta: 'Začněte svou cestu'
    },
    theory: {
      title: 'Model Finančních Hasičů',
      subtitle: 'Porozumění emočnímu prostředí finančních rozhodnutí',
      description: 'Finanční rozhodnutí zřídka souvisí pouze s čísly. Jsou hluboce propojena s našimi emocemi, minulými zkušenostmi a psychologickými vzorci. Model Finančních Hasičů vám pomáhá tyto vzorce pochopit a transformovat.',
      emotionsMatter: {
        title: 'Proč emoce záleží',
        description: 'Tradiční finanční poradenství se často zaměřuje na znalosti a disciplínu, ale ignoruje emoční faktory, které ovlivňují naše rozhodnutí. Porozumění těmto emočním vzorcům je klíčem k trvalé změně.'
      },
      ifsConnection: {
        title: 'Spojení s IFS',
        description: 'Založeno na terapii Internal Family Systems (IFS), tento model vám pomáhá identifikovat a pracovat s různými "částmi" sebe sama, které ovlivňují vaše finanční chování.'
      }
    },
    firefighters: {
      title: 'Typy Finančních Hasičů',
      subtitle: 'Rozpoznejte své vzorce a pochopte jejich účel',
      spender: {
        title: 'Utráceč',
        description: 'Používá nakupování a utrácení jako způsob zvládání stresu, hledá okamžitou úlevu prostřednictvím nákupů.'
      },
      hoarder: {
        title: 'Hromadič',
        description: 'Šetří nadměrně, často poháněn strachem a úzkostí z budoucího zabezpečení.'
      },
      avoider: {
        title: 'Vyhýbač',
        description: 'Vyhýbá se řešení financí, často kvůli minulým negativním zkušenostem.'
      }
    },
    features: {
      title: 'Hlavní funkce',
      subtitle: 'Nástroje navržené k transformaci vašeho finančního vztahu',
      expenseHighlighter: {
        title: 'Zvýrazňovač výdajů',
        description: 'Kategorizujte výdaje jako \'Životní\' vs. \'Životní styl\' pro podporu vědomého rozhodování o výdajích.',
        button: 'Sledovat Vaše Výdaje'
      },
            financialGPS: {        title: 'Finanční GPS',        description: 'Sledujte svou finanční cestu s jasným pohledem na minulá rozhodnutí a budoucí cíle.',        button: 'Prozkoumat Vaši Cestu'      },
            ifsDialogue: {        title: 'IFS Dialog',        description: 'Zapojte se do vedených konverzací se svými finančními částmi, abyste pochopili jejich potřeby.',        button: 'Začít Dialog'      },
            selfCompassion: {        title: 'Praxe sebelásky',        description: 'Rozvíjejte laskavější vztah k sobě a své finanční cestě.',        button: 'Praktikovat Sebelásku'      }
    }
  },
  selfCompassion: {
    title: 'Denní Sebesoucit',
    subtitle: 'Okamžik pro laskavost a reflexi.',
    calmScore: {
      label: 'Jak klidný se cítíte právě teď? (1-10)',
      saveButton: 'Uložit Skóre & Reflektovat',
      newPromptButton: 'Získat Nový Podnět k Sebesoucit'
    },
    journey: {
      title: 'Vaše Cesta ke Klidu',
      subtitle: 'Sledujte své vlastní hodnocení klidu v čase.',
      currentAverage: 'Aktuální průměrný klid:'
    },
    criticalThoughts: {
      title: 'Poměr Sebekritických Výroků',
      subtitle: 'Sledujte svůj vnitřní dialog. (Placeholder pro sledování)',
      comingSoon: 'Funkce brzy k dispozici. Tato sekce vám pomůže sledovat a porozumět vzorcům sebekritických myšlenek, podporujíc laskavější vnitřní hlas.'
    },
    prompts: [
      'Dnes se budu k sobě chovat se stejnou laskavostí, jakou bych nabídl dobrému příteli.',
      'Chyby jsou součástí učení. Odpouštím si jakékoli finanční omyly.',
      'Dělám to nejlepší s tím, co mám, a to stačí.',
      'Uznávám své finanční obavy bez souzení a nabízím si útěchu.',
      'Zaměřuji se na pokrok, ne na dokonalost, ve své finanční cestě.'
    ]
  },
  expenseHighlighter: {
    title: 'Zvýraznění Výdajů',
    subtitle: 'Sledujte a kategorizujte své výdaje pro lepší pochopení vzorců utrácení.',
    addExpense: 'Přidat Výdaj',
    editExpense: 'Upravit Výdaj',
    deleteExpense: 'Smazat Výdaj',
    categories: {
      living: 'Životní Výdaje',
      lifestyle: 'Výdaje na Životní Styl'
    },
    form: {
      amount: 'Částka',
      description: 'Popis',
      category: 'Kategorie',
      date: 'Datum'
    }
  },
  financialGPS: {
    title: 'Finanční GPS',
    subtitle: 'Mapujte svou finanční cestu: Minulost, Přítomnost a Budoucnost.',
    timeline: {
      title: 'Vaše Finanční Časová Osa',
      subtitle: 'Klíčové momenty, které formovaly vaši finanční krajinu a současný stav.',
      empty: 'Zatím žádné události na časové ose. Přidejte první pro začátek!',
      addEvent: 'Přidat Událost',
      addEventDescription: 'Dokumentujte významný finanční moment nebo svůj současný stav.',
      form: {
        title: 'Název',
        date: 'Datum',
        type: 'Typ',
        description: 'Popis',
        save: 'Uložit Událost',
        types: {
          past: 'Minulý Vliv',
          present: 'Současný Snapshot',
          future: 'Budoucí Cíl/Vize'
        }
      }
    },
    visionBoard: {
      title: 'Finanční Vize',
      subtitle: 'Vizualizujte své finanční cíle a aspirace.',
      empty: 'Vaše vize je prázdná. Přidejte položky pro vizualizaci vašich cílů!',
      addItem: 'Přidat do Vize',
      addItemDescription: 'Přidejte textová potvrzení nebo obrázky pro vizualizaci vašich finančních cílů.',
      imageAlt: 'Obrázek vize',
      form: {
        type: 'Typ',
        content: 'Obsah',
        description: 'Popis',
        save: 'Přidat Položku',
        types: {
          text: 'Textové Potvrzení',
          image: 'Obrázek (URL)'
        }
      }
    },
    youAreHere: {
      title: 'Jste zde',
      description: "Zamyslete se nad svou aktuální finanční pozicí na základě vaší časové osy.",
      content: "Na základě událostí na časové ose, zejména vašich záznamů 'Současný stav', si udělejte chvilku na zamyšlení, kde se právě nacházíte na své finanční cestě. Toto je váš bod 'Jste zde'. Jasné pochopení této pozice je prvním krokem k dosažení vaší vysněné budoucnosti."
    }
  },
  ifsDialogue: {
    title: 'IFS Dialog: Pochopte své finanční části',
    subtitle: 'Použijte AI k identifikaci a pochopení vašich vnitřních finančních "hasicích" částí pomocí 6F rámce.',
    form: {
      financialSituation: {
        label: 'Vaše Současná Finanční Situace',
        placeholder: 'např. Bojuji s dluhy, šetřím na dům...',
        error: 'Prosím, popište svou finanční situaci podrobněji.'
      },
      recentFinancialBehavior: {
        label: 'Nedávné Finanční Chování/Rozhodnutí',
        placeholder: 'např. Nedávno jsem provedl velký impulzivní nákup, vyhýbám se pohledu na svůj bankovní účet...',
        error: 'Prosím, popište své nedávné finanční chování.'
      },
      personalityType: {
        label: 'Primární Komunikační Styl',
        placeholder: 'Vyberte svůj preferovaný styl',
        error: 'Prosím, vyberte typ osobnosti.',
        options: {
          analytical: 'Analytický & Přímý',
          expressive: 'Expresivní & Nadšený',
          amiable: 'Přívětivý & Podpůrný',
          driver: 'Řidič & Zaměřený na Výsledky',
          gentle: 'Jemný & Opatrný'
        }
      }
    },
    identifyButton: 'Identifikovat Finanční Část',
    error: {
      title: 'Chyba',
      identifyFailed: 'Nepodařilo se identifikovat část. Prosím, zkuste to znovu.',
      resolveFailed: 'Nepodařilo se vyřešit část. Prosím, zkuste to znovu.'
    },
    result: {
      title: 'Identifikovaná Část: {partName}',
      role: 'Role',
      burden: 'Břemeno',
      concern: 'Obava',
      suggestedEngagement: 'Doporučený Přístup',
      engagementDescription: 'Tato strategie navrhuje přizpůsobený přístup ke komunikaci s touto částí na základě její povahy a vašeho profilu.'
    }
  }
} as const; 