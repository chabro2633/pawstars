export interface OwnerInfo {
  name: string;
  birthDate: string;
  gender: 'male' | 'female' | '';
  phoneNumber: string;
  address: string;
  email: string;
  unknownBirthTime?: boolean;
  birthTimeSlot?: string;
}

export interface PetInfo {
  name: string;
  species: string;
  breed: string;
  customBreed?: string;
  birthDate: string;
  birthYear?: string;
  birthMonth?: string;
  birthDay?: string;
  unknownExactDate?: boolean;
  gender: 'male' | 'female' | '';
  sex: 'male' | 'female' | '';
  weight: number;
  isNeutered: boolean;
  isVaccinated: boolean;
  isMicrochipped: boolean;
  personality: string[];
  healthIssues: string[];
  specialNeeds: string;
}
