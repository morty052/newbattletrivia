export type Debuffs = "crushed" | "confused" | "snared" | "empowered" | "none";

export type TstatusTypes =
  | "empowered"
  | "enranged"
  | "concertrated"
  | "brainstorming"
  | "shocked"
  | "none";

export type characterName =
  | "Arhuanran"
  | "Athena"
  | "Da Vinci"
  | "Osun"
  | "Washington"
  | "Confucious";

export type character = {
  name:
    | "Arhuanran"
    | "Athena"
    | "Da Vinci"
    | "Ife"
    | "Washington"
    | "Confucious";
  bio: string;
  avatar?: string;
  traits?: {
    peeks: number;
    peekType: string;
    lives: 2 | 3 | 4 | 6;
    ultimate: "REJUVENATE" | "INVENT" | "CONQUER" | "FORSEE";
    debuff: Debuffs;
  };
};
