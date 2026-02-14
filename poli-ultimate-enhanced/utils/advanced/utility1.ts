export const utility1 = (input: any) => {
  console.log('Utility 1 processing:', input);
  return input;
};

export const transform1 = (data: any) => {
  return { ...data, transformed: true, utility: 1 };
};
