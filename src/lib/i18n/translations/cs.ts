export const cs = {
  common: {
    appName: 'InnerBalance',
    loading: 'Načítání...',
    error: 'Došlo k chybě',
    save: 'Uložit',
    cancel: 'Zrušit',
    delete: 'Smazat',
    edit: 'Upravit',
    importantLimitation: 'Důležité omezení',
    legalQuestions: 'Právní otázky',
  },
  navigation: {
    home: 'Domů',
    overview: 'Přehled',
    selfAssessment: 'Sebehodnocení',
    expenseHighlighter: 'Zvýrazňovač výdajů',
    financialGPS: 'Finanční GPS',
    selfCompassion: 'Sebesoucit',
  },
  landing: {
    hero: {
      title: 'Transformujte svůj vztah k penězům',
      subtitle: 'Objevte, jak porozumění vašim emočním vzorcům může vést k lepším finančním rozhodnutím a trvalé změně.',
      cta: 'Poznejte své Hasiče'
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
        title: 'Potvrzeno vědou',
        description: 'Založeno na terapii Internal Family Systems (IFS), tento model vám pomáhá identifikovat a pracovat s různými "částmi" sebe sama, které ovlivňují vaše finanční chování.'
      }
    },
    firefighters: {
      title: 'Typy Finančních Hasičů',
      subtitle: 'Rozpoznejte své vzorce a pochopte jejich účel',
      introduction: {
        title: 'Co jsou Finanční Hasiči?',
        description: 'Jsou to ochranné části nás, které vstupují do akce během finančního stresu. Jako skuteční hasiči to myslí dobře, ale někdy používají extrémní opatření, která později mohou způsobit problémy.'
      },
      spender: {
        title: 'Utráceč',
        description: 'Když přijde stres nebo osamělost, tato část spěchá s rychlými nákupy a vylepšeními, aby zvedla náladu. Doufá, že každý nákup vám připomene, že na vás záleží, a zabrání úzkosti proniknout. Představte si to jako přítele, který vám podává malý dárek, aby vám rozjasnili den.',
        triggers: {
          label: 'Běžné situace, které aktivují tohoto hasiče:',
          items: [
            'Náhlý nárůst stresu, nudy nebo osamělosti',
            'Sociální média odhalí výprodeje nebo "omezené nabídky"',
            'Emoční vrcholy, které šeptají "oslavme!"'
          ]
        },
        behaviors: {
          label: 'Jak tento hasič typicky reaguje:',
          items: [
            'Nákupy jedním kliknutím nebo rychlé "Přidat do košíku" záchvaty',
            'Impulzivní upgrady na prémiové verze',
            'Lastminute upgrady letů, hotelů, jídel'
          ]
        },
        healingPath: 'Učení se pozastavit a identifikovat emoční potřeby před nákupem'
      },
      hoarder: {
        title: 'Hromadič',
        description: 'Formován minulou nedostatkem, Hromadič pracuje neustále, aby uschoval každé volné euro. Vynechávání výdajů nebo zábavy není chamtivost; je to jeho způsob, jak říci "Budeš v bezpečí bez ohledu na cokoliv." Šetření je láska Hromadiče vyjádřená jazykem, zabaluje vás do tlusté deky bezpečí.',
        triggers: {
          label: 'Běžné situace, které aktivují tohoto hasiče:',
          items: [
            'Zprávy o propouštění, recesi nebo lékařských účtech',
            'Vidění jiných, kteří bojují finančně',
            'Velké příjmy, které probouzejí instinkty "zamknout to pryč"'
          ]
        },
        behaviors: {
          label: 'Jak tento hasič typicky reaguje:',
          items: [
            'Přesměrovává každé extra euro do úspor',
            'Ruší nezbytnou údržbu, aby se vyhnul výdajům',
            'Vytváří několik "nedotknutelných" podúčtů'
          ]
        },
        healingPath: 'Budování důvěry ve finanční bezpečnost při umožnění současných potřeb'
      },
      avoider: {
        title: 'Vyhýbač',
        description: 'Účty a zůstatky mohou spustit starou hanbu, takže Vyhýbač vás chrání tím, že nechává obálky neotevřené a aplikace nekontrolované. Není to lenost—je to ochrana, poskytuje vašemu nervovému systému přestávku, dokud se necítíte silnější. Jeho cíl je jednoduchý: ušetřit vás od přetížení právě teď.',
        triggers: {
          label: 'Běžné situace, které aktivují tohoto hasiče:',
          items: [
            'Příchod účtů, bankovních výpisů, daňových formulářů',
            'Rozhovory o rozpočtech nebo investování',
            'Připomínky minulých finančních chyb'
          ]
        },
        behaviors: {
          label: 'Jak tento hasič typicky reaguje:',
          items: [
            'Nechává finanční dokumenty neotevřené',
            'Maže finanční aplikace nebo ztlumuje oznámení',
            'Zapojuje se do "produktivní prokrastinace"'
          ]
        },
        healingPath: 'Vytváření bezpečí kolem finančního uvědomění pomocí malých, jemných kroků'
      },
      indulger: {
        title: 'Požitkář',
        description: 'Když se život cítí nudný nebo těžký, Požitkář skočí s večeřemi venku, výlety nebo VIP vstupenkami. Věří, že radost je nezbytné palivo a bojí se, že příliš mnoho zdrženlivosti vyčerpá vašeho ducha. Vytvářením výbuchů potěšení vám pomáhá vzpomenout si, že život je pro život, ne jen pro přežití.',
        triggers: {
          label: 'Běžné situace, které aktivují tohoto hasiče:',
          items: [
            'Konec stresujícího dne/týdne',
            'Oslavné momenty ("Zvládli jsme projekt!")',
            'Společenské pozvánky slibující zábavné zážitky'
          ]
        },
        behaviors: {
          label: 'Jak tento hasič typicky reaguje:',
          items: [
            'Utrácí za jídlo venku, upgrady cestování, VIP vstupenky',
            'Doručení tentýž den lahůdek a gadgetů',
            'Ignoruje rozpočet s "YOLO" logikou'
          ]
        },
        healingPath: 'Nalezení udržitelných způsobů oslavy a odměňování bez finančního poškození'
      },
      tabs: {
        triggers: 'Spouštěče',
        behaviors: 'Chování',
        healing: 'Léčení'
      },
      healing: {
        title: 'Cesta k rovnováze'
      },
      assessment: {
        title: 'Rychlé sebehodnocení',
        description: 'Nejste si jisti, který hasič je ve vašem životě nejaktivnější? Absolvujte rychlé hodnocení pro identifikaci vašich primárních finančních zvládacích vzorců.',
        startButton: 'Začít sebehodnocení',
        inProgress: 'Odpovězte na několik otázek pro objevení vašeho primárního typu hasiče...',
        reset: 'Reset'
      },
      peoplePercentage: '~{percentage}% lidí',
      discoverButton: 'Objevte svého hasiče',
      compassionButton: 'Praktikujte sebelásku'
    },
    features: {
      title: 'Hlavní funkce',
      subtitle: 'Nástroje navržené k transformaci vašeho finančního vztahu',
      selfAssessment: {
        title: 'Sebehodnocení',
        description: 'Objevte, které finanční "hasičské" části jsou ve vašem životě nejaktivnější a dozvíte se o jejich ochranných záměrech.',
        button: 'Provést hodnocení',
      },
      expenseHighlighter: {
        title: 'Zvýrazňovač výdajů',
        description: 'Nahrajte bankovní výpisy a objevte emocionální vzorce za vašimi výdaji s AI poznatky.',
        button: 'Analyzovat výdaje',
      },
      financialGPS: {
        title: 'Finanční GPS',
        description: 'Získejte personalizované vedení pro vaši finanční cestu založené na vaší jedinečné situaci a cílech.',
        button: 'Začít navigaci',
      },
      selfCompassion: {
        title: 'Praktiky sebesoucitu',
        description: 'Naučte se techniky založené na důkazech, jak se k sobě chovat laskavě během finančních výzev.',
        button: 'Praktikovat soucit',
      }
    }
  },
  selfCompassion: {
    title: 'Denní praxe sebelásky',
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
    editExpense: 'Upravit',
    deleteExpense: 'Smazat',
    overview: 'Přehled',
    total: 'Celkové Výdaje',
    yourExpenses: 'Vaše Výdaje',
    noExpenses: 'Zatím jste nepřidali žádné výdaje. Klikněte na "Přidat Výdaj" pro začátek.',
    actions: 'Akce',
    selectCategory: 'Vyberte kategorii',
    addDescription: 'Vyplňte níže uvedené údaje pro přidání nového výdaje.',
    editDescription: 'Aktualizujte údaje tohoto výdaje.',
    livingDescription: 'Nezbytné náklady jako nájem/hypotéka, služby, potraviny, doprava do práce, pojištění.',
    lifestyleDescription: 'Volitelné výdaje jako stravování venku, zábava, koníčky, cestování, luxusní předměty.',
    unassigned: 'Nezařazené',
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
      title: 'Zpomalte a zamyslite se',
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
    },
    identifyButton: 'Identifikovat Finanční Část',
    repeatAssessmentButton: 'Opakovat hodnocení hasičských částí',
    explorePartButton: 'Prozkoumat tuto část hlouběji',
    premiumFeatureTooltip: 'Toto hluboké prozkoumání je prémiová funkce. Pro aktivaci prémiových funkcí se přihlaste k odběru.',
    error: {
      title: 'Chyba',
      identifyFailed: 'Nepodařilo se identifikovat část. Prosím, zkuste to znovu.',
      resolveFailed: 'Nepodařilo se vyřešit část. Prosím, zkuste to znovu.'
    },
    result: {
      title: 'Vaše hlavní typ Hasiče: {partName}',
      role: 'Role',
      burden: 'Břemeno',
      concern: 'Obava',
      suggestedEngagement: 'Doporučený Přístup',
      engagementDescription: 'Tato strategie navrhuje přizpůsobený přístup ke komunikaci s touto částí na základě její povahy a vašeho profilu.'
    }
  },
  groundingExercise: {
    title: 'Najděte si chvilku k dýchání',
    subtitle: 'Soustřeďte se na svůj dech. Jste v bezpečí.',
    introduction: 'Zkusíme rychlé uklidňující cvičení:',
    steps: {
      see: 'Všimněte si 5 věcí, které vidíte kolem sebe.',
      touch: 'Všimněte si 4 věcí, kterých se můžete dotknout.',
      hear: 'Všimněte si 3 věcí, které slyšíte.',
      smell: 'Všimněte si 2 věcí, které cítíte.',
      taste: 'Všimněte si 1 věci, kterou můžete ochutnat.'
    },
    breathingPrompt: 'Zhluboka se nadechněte... a pomalu vydechněte.',
    continueButton: 'Jsem připraven(a) pokračovat'
  },
  footer: {
    description: 'AI-poháněná finanční terapie a koučování pro emoční pohodu a finanční zdraví.',
    legal: 'Právní',
    support: 'Podpora',
    privacyPolicy: 'Ochrana soukromí',
    termsOfService: 'Podmínky služby',
    emergencyProtocol: 'Nouzový protokol',
    privacyQuestions: 'Otázky o soukromí',
    generalSupport: 'Obecná podpora',
    allRightsReserved: 'Všechna práva vyhrazena.',
    madeWithLove: 'Vytvořeno s vědomím v České republice',
    disclaimerLabel: 'Upozornění',
    disclaimer: 'InnerBalance je nástroj pro digitální wellness a nenahrazuje profesionální finanční poradenství nebo léčbu duševního zdraví. Pokud prožíváte krizi duševního zdraví, kontaktujte prosím místní záchranné služby nebo odborníka na duševní zdraví.'
  },
  privacyPolicy: {
    title: 'Ochrana soukromí',
    lastUpdated: 'Naposledy aktualizováno: {date}',
    sections: {
      intro: {
        title: 'Vaše soukromí záleží',
        content: 'Ve společnosti InnerBalance chápeme, že finanční a emoční data jsou hluboce osobní. Tyto zásady ochrany soukromí vysvětlují, jak shromažďujeme, používáme, chráníme a respektujeme vaše informace při poskytování našich AI-poháněných služeb finanční terapie a koučování.'
      },
      informationWeCollect: {
        title: 'Informace, které shromažďujeme',
        financialInfo: {
          title: 'Finanční informace',
          items: [
            'Data o výdajích, která kategorizujete jako "Životní" vs "Životní styl" prostřednictvím našeho nástroje Zvýrazňovač výdajů',
            'Informace o finanční časové ose včetně minulých vlivů, současného snímku a budoucích cílů prostřednictvím Finančního GPS',
            'Data o nouzových fondech a finančním plánování',
            'Samy hlášené finanční chování a vzorce'
          ]
        },
        emotionalData: {
          title: 'Emoční a psychologická data',
          items: [
            'Odpovědi z IFS dialogu identifikující vaše finanční "hasičské" části',
            'Data o praxi sebelásky a hodnocení klidu',
            'Emoční reakce a mechanismy zvládání související s finančním stresem',
            'Data z koučovacích sezení informovaných o traumatu',
            'Používání panikového tlačítka a účast na uklidňujících cvičeních',
            'Sledování sebepokřivujících výroků v čase'
          ]
        },
        technicalInfo: {
          title: 'Technické informace',
          items: [
            'Informace o zařízení a typu prohlížeče',
            'Vzorce používání a interakční data s našimi AI nástroji',
            'Doba trvání relace a analytika používání funkcí',
            'Protokoly chyb a data o výkonu'
          ]
        }
      },
      howWeUseInfo: {
        title: 'Jak používáme vaše informace',
        primaryPurposes: {
          title: 'Hlavní účely',
          items: [
            'Poskytování personalizované AI-poháněné finanční terapie a koučování',
            'Generování poznatků o vašich finančních "hasičských" částech pomocí IFS metodologie',
            'Sledování vašeho emočního a finančního wellness pokroku',
            'Poskytování soucitného, traumatu-informovaného finančního vedení',
            'Přizpůsobení podnětů k sebelásce a mindfulness cvičení'
          ]
        },
        aiProcessing: {
          title: 'AI zpracování',
          items: [
            'Naše AI analyzuje váš vstup pro poskytování personalizovaných koučovacích odpovědí',
            'Rozpoznávání vzorců pro identifikaci finančního chování a emočních spouštěčů',
            'Generování podpůrných zpráv sladěných s vaším emočním stavem',
            'Hodnocení komunikačních strategií na základě vašeho typu osobnosti'
          ]
        }
      },
      dataSecurityAndProtection: {
        title: 'Bezpečnost a ochrana dat',
        securityFirst: 'Vzhledem k citlivé povaze finančních a emočních dat implementujeme bezpečnostní opatření na podnikové úrovni včetně end-to-end šifrování, bezpečného ukládání dat a pravidelných bezpečnostních auditů.',
        technicalSafeguards: {
          title: 'Technické záruky',
          items: [
            'End-to-end šifrování pro veškerý přenos dat',
            'Šifrované ukládání všech osobních informací',
            'Pravidelná hodnocení bezpečnostních zranitelností',
            'Vícefaktorová autentifikace pro přístup k účtu',
            'Bezpečná cloudová infrastruktura s průmyslovými standardy ochrany'
          ]
        },
        accessControls: {
          title: 'Kontroly přístupu',
          items: [
            'Striktní kontroly přístupu zaměstnanců na základě potřeby vědět',
            'Pravidelné revize přístupu a auditní stopy',
            'Dohody o důvěrnosti pro všechny zaměstnance',
            'Specializované školení pro zacházení s citlivými psychologickými daty'
          ]
        }
      },
      yourRights: {
        title: 'Vaše práva a kontrola',
        accessAndControl: {
          title: 'Přístup a kontrola',
          items: [
            'Zobrazit všechna data, která jsme o vás shromáždili',
            'Stáhnout vaše data v přenosném formátu',
            'Opravit nepřesné informace',
            'Smazat konkrétní datové záznamy nebo celý váš účet',
            'Odhlásit se z určitých aktivit zpracování dat'
          ]
        },
        panicMode: {
          title: 'Ochrana v panikovém režimu',
          items: [
            'Okamžité schování dat prostřednictvím naší funkce "Červené tlačítko paniky"',
            'Okamžitý přístup k uklidňujícím cvičením bez uchovávání dat',
            'Možnost pozastavit veškeré shromažďování dat během emočního stresu'
          ]
        }
      },
      ethicalCommitment: {
        title: 'Etický závazek',
        content: 'Uznáváme, že naše aplikace zpracovává citlivé informace o duševním zdraví. Dodržujeme etické směrnice pro digitální nástroje duševního zdraví a udržujeme nejvyšší standardy péče.'
      },
      contactUs: {
        title: 'Kontaktujte nás',
        content: 'Pokud máte otázky ohledně těchto zásad ochrany soukromí nebo jak zacházíme s vašimi daty, kontaktujte nás:',
        email: 'privacy@innerbalance.app',
        responseTime: 'Na dotazy ohledně soukromí odpovídáme do 72 hodin'
      },
      trustIsSacred: 'Chápeme, že rozhodnutí sdílet s námi svou finanční a emoční cestu vyžaduje obrovskou důvěru. Tuto důvěru ctíme udržováním nejvyšších standardů ochrany soukromí a etického zacházení s daty.'
    }
  },
  termsOfService: {
    title: 'Podmínky služby',
    lastUpdated: 'Naposledy aktualizováno: {date}',
    sections: {
      welcome: 'Tyto podmínky upravují vaše používání naší AI-poháněné platformy finanční terapie a koučování. Používáním našich služeb souhlasíte s těmito podmínkami a naším závazkem podporovat vaši cestu finančního wellness.',
      acceptanceOfTerms: {
        title: 'Přijetí podmínek',
        content: 'Přístupem nebo používáním InnerBalance ("Služba") souhlasíte s tím, že budete vázáni těmito Podmínkami služby a našimi Zásadami ochrany soukromí. Pokud s těmito podmínkami nesouhlasíte, nepoužívejte prosím Službu.'
      },
      serviceDescription: {
        title: 'Popis služby',
        content: 'InnerBalance je AI-poháněná platforma digitálního wellness, která poskytuje:',
        features: [
          'Analýzu finančního chování pomocí metodologie Internal Family Systems (IFS)',
          'AI-poháněné koučovací a terapeutické nástroje pro finanční wellness',
          'Funkce sledování a kategorizace výdajů',
          'Mapování finanční časové osy a vizualizaci cílů',
          'Cvičení sebelásky a mindfulness',
          'Funkce panikového režimu a uklidňujících cvičení'
        ]
      },
      importantLimitation: 'InnerBalance je nástroj digitálního wellness a NENAHRAZUJE profesionální finanční poradenství, terapii nebo léčbu duševního zdraví. Nejsme licencovaní finanční poradci nebo odborníci na duševní zdraví.',
      userEligibility: {
        title: 'Způsobilost uživatele',
        ageRequirements: {
          title: 'Věkové požadavky',
          items: [
            'Pro používání této Služby musíte být starší nejméně 18 let',
            'Uživatelům mladším 18 let je zakázáno vytvářet účty'
          ]
        }
      },
      emergencyProtocol: {
        title: 'Nouzový protokol',
        content: 'Pokud máte myšlenky na sebepoškození nebo jste v krizi, okamžitě kontaktujte:',
        contacts: [
          'Tísňova linka 112 (evropské tísňové číslo) nebo 155 (záchranná služba).',
          'Linka první psychické pomoci (24/7, dospělí): 116 123',
          'Linka bezpečí (24/7, děti a mládež do 26 let): 116 111 aneb Chat a e-mail pomoc@linkabezpeci.cz'
        ]
      },
      contactInfo: {
        title: 'Kontaktní informace',
        content: 'Pro otázky ohledně těchto podmínek nebo naší Služby:',
        generalSupport: 'support@innerbalance.app',
        legalQuestions: 'legal@innerbalance.app',
        privacyConcerns: 'privacy@innerbalance.app'
      },
      commitment: 'Jsme odhodláni podporovat vaši cestu finančního wellness se soucitem, respektem a nejvyššími etickými standardy. Tyto podmínky existují pro ochranu jak vás, tak naší schopnosti poskytovat tuto důležitou službu.'
    }
  },
  selfAssessment: {
    title: 'Sebehodnocení',
    subtitle: 'Objevte své finanční vzorce a naučte se s nimi pracovat soucitně',
    quiz: {
      title: 'Rychlé hodnocení hasičů',
      description: 'Proveďte tento krátký kvíz k identifikaci vašeho primárního typu finančního hasiče',
      instruction: 'Odpovězte na 4 rychlé otázky a objevte, která finanční "hasičská" část je ve vašem životě nejaktivnější.',
      startButton: 'Začít hodnocení',
      result: 'Váš primární typ hasiče je:',
      resultDescription: 'Toto vás úplně nedefinuje—všichni máme více částí. Porozumění vašemu dominantnímu vzorci je prvním krokem k finančnímu sebesoucitu.'
    },
    deepAssessment: {
      title: 'Hluboké hodnocení',
      description: 'Pro podrobnější analýzu popište svou konkrétní finanční situaci a vzorce.',
      formTitle: 'Personalizovaná identifikace finanční části',
      formDescription: 'Sdílejte své finanční zkušenosti a pomůžeme vám pochopit části sebe, které ovlivňují vaše rozhodnutí o penězích.'
    },
    form: {
      financialSituation: {
        label: 'Popište svou současnou finanční situaci',
        placeholder: 'Sdílejte, co se děje s vašimi financemi právě teď - dluhy, příjmy, výdaje, cíle, výzvy...',
        error: 'Prosím poskytněte více podrobností o vaší finanční situaci.'
      },
      recentFinancialBehavior: {
        label: 'Popište své nedávné finanční chování',
        placeholder: 'Řekněte nám o vašem utrácení, spoření nebo rozhodnutích týkajících se peněz v posledních týdnech nebo měsících...',
        error: 'Prosím popište své nedávné finanční chování podrobněji.'
      }
    },
    identifyButton: 'Identifikovat mé finanční části',
    repeatAssessmentButton: 'Začít nové hodnocení',
    explorePartButton: 'Prozkoumat tuto část hlouběji',
    premiumFeatureTooltip: 'Tento hluboký průzkum je prémiová funkce. Přihlaste se k odběru pro aktivaci prémiových funkcí.',
    result: {
      title: 'Seznamte se s vaším {partName}',
      role: 'Role',
      burden: 'Co nese',
      concern: 'Jeho největší obava',
      suggestedEngagement: 'Jak s touto částí pracovat',
      engagementDescription: 'Pamatujte: tato část se vám snaží pomoci. Přistupujte k ní se zvědavostí a soucitem.'
    },
    error: {
      title: 'Něco se pokazilo',
      identifyFailed: 'Nelze identifikovat vaše finanční části. Zkuste to prosím znovu.',
      resolveFailed: 'Nelze tuto část prozkoumat dále. Zkuste to prosím znovu.'
    }
  }
} as const; 