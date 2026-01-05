import React from "react";
import { X, Trash2, Play, Calendar, Briefcase, User } from "lucide-react";
import { Character, Locale } from "../types/Character";

interface CharacterInfoProps {
  character: Character;
  onClose: () => void;
  isAllowedtoDelete: boolean;
  PlayCharacter: () => void;
  handleDelete: () => void;
  locale: Locale;
}

const genderLabel = (g: any) => {
  // obsłuż też wersje liczbowe 0/1 jeśli gdzieś tak przyjdzie
  if (g === 0) return "Male";
  if (g === 1) return "Female";

  if (g === "m" || g === "M") return "Male";
  if (g === "f" || g === "F") return "Female";
  return "—";
};

const CharacterInfo: React.FC<CharacterInfoProps> = ({
  character,
  onClose,
  isAllowedtoDelete,
  PlayCharacter,
  handleDelete,
  locale,
}) => {
  if (!character) return null;

  const birthDate = (character as any).birthDate || "—";
  const occupation = (character as any).occupation || "—";
  const gender = (character as any).sex ?? (character as any).gender;

  return (
    <div className="pulse-info">
      <div className="pulse-info__head">
        <div className="pulse-info__title">
          {locale?.char_info_title || "Character details"}
        </div>
        <button className="pulse-iconbtn" onClick={onClose} title="Close">
          <X size={18} />
        </button>
      </div>

      <div className="pulse-info__name">{character.name}</div>

      <div className="pulse-info__grid">
        <div className="pulse-info__item">
          <Calendar size={16} />
          <div>
            <div className="pulse-info__label">Date of birth</div>
            <div className="pulse-info__value">{birthDate}</div>
          </div>
        </div>

        <div className="pulse-info__item">
          <Briefcase size={16} />
          <div>
            <div className="pulse-info__label">Job</div>
            <div className="pulse-info__value">{occupation}</div>
          </div>
        </div>

        <div className="pulse-info__item">
          <User size={16} />
          <div>
            <div className="pulse-info__label">Gender</div>
            <div className="pulse-info__value">{genderLabel(gender)}</div>
          </div>
        </div>
      </div>

      <div className="pulse-info__actions">
        <button className="pulse-btn pulse-btn--primary" onClick={PlayCharacter}>
          <Play size={18} />
          {locale?.play || "Graj"}
        </button>

        {isAllowedtoDelete && (
          <button className="pulse-btn pulse-btn--danger" onClick={handleDelete}>
            <Trash2 size={18} />
            Delete character
          </button>
        )}
      </div>
    </div>
  );
};

export default CharacterInfo;
