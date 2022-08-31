export const makeId = (length) => {
  const characters = 'qwertyuiopasdfghjklzxcvbnmQWERTYUIUOPASDFGHJKLZXCVBNM1234567890';
  let returnMe = '';
  for (let i = 0; i < length; i++) {
    const j = Math.floor(Math.random() * characters.length);
    returnMe += characters[j];
  }
  return returnMe;
};

