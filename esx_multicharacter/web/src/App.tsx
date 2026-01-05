import CharacterSelection from "./components/CharacterSelection";
import { useEffect, useState } from "react";
import { useNuiEvent } from "./utils/useNuiEvent";
import { Character, Locale } from "./types/Character";
import { fetchNui } from "./utils/fetchNui";

const isNui = () => typeof (window as any).GetParentResourceName === "function";

function App() {
  const [isVisible, setIsVisible] = useState(false);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [Candelete, setCandelete] = useState(false);
  const [MaxAllowedSlot, setMaxAllowedSlot] = useState(0);

  const [locale, setLocale] = useState<Locale>({
    title: "Character Selection",
    play: "Play",
    char_info_title: "Character Info",
  });

  // Browser/preview mock so you can see UI without FiveM
  useEffect(() => {
    if (isNui()) {
      fetchNui("nuiReady");
      return;
    }

    setIsVisible(true);
    setCandelete(true);
    setMaxAllowedSlot(4);
    setLocale({
      title: "Character Selection",
      play: "Play",
      char_info_title: "Character Info",
    });

    setCharacters([
      {
        id: "1",
        name: "Posej Sigiemka",
        birthDate: "1998-06-11",
        gender: "m",
        occupation: "mechanic",
        disabled: false,
        isActive: true,
      } as any,
      {
        id: "2",
        name: "Posej rewrite",
        birthDate: "2006-12-12",
        gender: "m",
        occupation: "police",
        disabled: false,
        isActive: false,
      } as any,
    ]);
  }, []);

  // FiveM event (ESX multichar)
  useNuiEvent("ToggleMulticharacter", (data: any) => {
    if (data?.show) {
      const valid = (data.Characters || []).filter((c: any) => c != null);

      const parsed: Character[] = valid.map((c: any, i: number) => ({
        id: String(c.id),
        name: `${c.firstname} ${c.lastname}`,
        birthDate: c.dateofbirth,
        gender: c.sex,
        occupation: c.job,
        disabled: c.disabled,
        isActive: i === 0,
      })) as any;

      setIsVisible(true);
      setCharacters(parsed);
      setCandelete(!!data.CanDelete);
      setMaxAllowedSlot(Number(data.AllowedSlot ?? 0));
      setLocale(
        data.Locale ?? {
          title: "Character Selection",
          play: "Play",
          char_info_title: "Character Info",
        }
      );
    } else {
      setIsVisible(false);
      setCharacters([]);
    }
  });

  return (
    isVisible && (
      <CharacterSelection
        initialCharacters={characters}
        Candelete={Candelete}
        MaxAllowedSlot={MaxAllowedSlot}
        locale={locale}
      />
    )
  );
}

export default App;
