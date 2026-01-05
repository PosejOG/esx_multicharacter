import React, { useMemo, useState } from "react";
import { Plus, Play, Info } from "lucide-react";
import CharacterInfo from "./CharacterInfo";
import { fetchNui } from "../utils/fetchNui";
import { Character, Locale } from "../types/Character";

// ✅ Logo serwera (wrzuć plik do: web/src/assets/logo.png)
import logo from "../assets/logo.png";

interface CharacterSelectionProps {
  initialCharacters: Character[];
  Candelete: boolean;
  MaxAllowedSlot: number;
  locale: Locale;
}

const CharacterSelection: React.FC<CharacterSelectionProps> = ({
  initialCharacters,
  Candelete,
  MaxAllowedSlot,
  locale,
}) => {
  const [characters, setCharacters] = useState<Character[]>(
    (initialCharacters || []).map((c, i) => ({
      ...c,
      isActive: c.isActive ?? i === 0,
    }))
  );

  const [openInfoId, setOpenInfoId] = useState<string | null>(null);

  const selected = useMemo(
    () => characters.find((c) => c.isActive) || null,
    [characters]
  );

  const select = (id: string) => {
    setCharacters((prev) => prev.map((c) => ({ ...c, isActive: c.id === id })));
  };

  const play = () => {
    if (!selected) return;
    fetchNui("PlayCharacter", { id: selected.id });
  };

  const create = () => {
    if (characters.length >= MaxAllowedSlot) return;
    fetchNui("CreateCharacter");
  };

  const del = () => {
    if (!selected) return;
    fetchNui("DeleteCharacter", { id: selected.id });

    // szybki feedback w preview
    setCharacters((prev) => {
      const remaining = prev.filter((c) => c.id !== selected.id);
      return remaining.map((c, i) => ({ ...c, isActive: i === 0 }));
    });
    setOpenInfoId(null);
  };

  const toggleInfo = (id: string) => {
    select(id);
    setOpenInfoId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="pulse-mc">
      {/* TOP BAR */}
      <header className="pulse-mc__top">
        <div className="pulse-mc__logo">
          {/* ✅ LOGO zamiast "P" */}
          <div className="pulse-mc__mark pulse-mc__mark--logo">
            <img src={logo} alt="PulseGG" />
          </div>

          <div>
            <div className="pulse-mc__brandName">Posej</div>
            <div className="pulse-mc__brandSub">Szybka zmiana tsx i css</div>
          </div>
        </div>

        <div className="pulse-mc__titleWrap">
          <div className="pulse-mc__title">{locale?.title || "Wybór postaci"}</div>
          <div className="pulse-mc__subtitle">Wybierz postać i wejdź do gry</div>
        </div>

        <div className="pulse-mc__right">
          <div className="pulse-mc__pill">
            Sloty: <b>{characters.length}</b>/<b>{MaxAllowedSlot}</b>
          </div>
        </div>
      </header>

      {/* LAYOUT */}
      <div className="pulse-mc__layout">
        {/* LEFT PANEL */}
        <aside className="pulse-mc__panel">
          <div className="pulse-mc__panelHead">
            <div className="pulse-mc__panelTitle">Your characters</div>
            <div className="pulse-mc__panelHint">
              Click the information icon to see details
            </div>
          </div>

          <div className="pulse-mc__list">
            {characters.map((c) => {
              const active = !!c.isActive;
              const opened = openInfoId === c.id;

              return (
                <div
                  key={c.id}
                  className={`pulse-mc__row ${active ? "is-active" : ""}`}
                  onClick={() => select(c.id)}
                >
                  <div className="pulse-mc__rowAccent" />

                  {/* ✅ ZAMIANA pustego pola na ikonę człowieka (FontAwesome) */}
                  <div className="pulse-mc__avatar" aria-hidden="true">
                    <i className="fa-solid fa-user" />
                  </div>

                  <div className="pulse-mc__meta">
                    <div className="pulse-mc__name">{c.name}</div>
                    <div className="pulse-mc__small">
                      ID: <span>{c.id}</span>
                      {c.occupation ? (
                        <>
                          {" • "}Job: <span>{c.occupation}</span>
                        </>
                      ) : null}
                      {(c as any).birthDate ? (
                        <>
                          {" • "}DoB.: <span>{(c as any).birthDate}</span>
                        </>
                      ) : null}
                    </div>
                  </div>

                  {/* Ikona info zamiast gwiazdki */}
                  <button
                    className={`pulse-mc__star ${opened ? "is-open" : ""}`}
                    title="Szczegóły postaci"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleInfo(c.id);
                    }}
                  >
                    <Info size={16} />
                  </button>
                </div>
              );
            })}

            {characters.length === 0 && (
              <div className="pulse-mc__empty">
                Brak postaci. Utwórz nową postać przyciskiem poniżej.
              </div>
            )}
          </div>

          {/* FOOTER */}
          <div className="pulse-mc__panelFoot">
            <div className="pulse-mc__actions">
              <button
                className={`pulse-mc__btn pulse-mc__btn--primary ${
                  characters.length >= MaxAllowedSlot ? "is-disabled" : ""
                }`}
                onClick={create}
                disabled={characters.length >= MaxAllowedSlot}
                title="Utwórz postać"
              >
                <Plus size={18} />
                Create a Character
              </button>

              <button
                className="pulse-mc__btn pulse-mc__btn--ghost"
                onClick={play}
                disabled={!selected}
                title={locale?.play || "Play"}
              >
                <Play size={18} />
                {locale?.play || "Play"}
              </button>
            </div>
          </div>
        </aside>

        {/* STAGE (kamera FiveM) */}
        <section className="pulse-mc__stage" />
      </div>

      {/* OVERLAY INFO */}
      {selected && openInfoId === selected.id && (
        <div className="pulse-mc__overlay" onClick={() => setOpenInfoId(null)}>
          <div
            className="pulse-mc__overlayInner"
            onClick={(e) => e.stopPropagation()}
          >
            <CharacterInfo
              character={selected}
              onClose={() => setOpenInfoId(null)}
              isAllowedtoDelete={Candelete}
              PlayCharacter={play}
              handleDelete={del}
              locale={locale}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CharacterSelection;
