export const utility2 = (input: any) => {
  console.log('Utility 2 processing:', input);
  return input;
};

export const transform2 = (data: any) => {
  return { ...data, transformed: true, utility: 2 };
};
