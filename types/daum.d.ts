declare global {
  interface Window {
    daum: {
      Postcode: new (options: {
        oncomplete: (data: {
          zonecode: string;
          roadAddress: string;
          jibunAddress: string;
          userSelectedType: 'R' | 'J';
          bname: string;
          buildingName: string;
          apartment: string;
        }) => void;
      }) => {
        open: () => void;
      };
    };
  }
}

export {};
