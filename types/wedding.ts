export interface WeddingData {
  groomName: string;
  brideName: string;
  weddingDate: string;
  weddingTime: string;
  venue: {
    name: string;
    address: string;
    floor: string;
  };
  contact: {
    groom: string;
    bride: string;
  };
  images: string[];
  backgroundMusic: string;
  message: string;
}
