export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export const mockImages = [
  { url: `https://oaidalleapiprodscus.blob.core.windows.net/private/org-2ux73zMk2HqRDsv8H86j8c7S/user-KUqwqa7diF1U6uWOUv1qgLTa/img-kTtfKHbzLaDzWmvNCP2ku4Km.png?st=2023-06-29T01%3A47%3A59Z&se=2023-06-29T03%3A47%3A59Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2023-06-28T20%3A53%3A22Z&ske=2023-06-29T20%3A53%3A22Z&sks=b&skv=2021-08-06&sig=MMPpVDWPn8Wei5Pkqrj5WAQlg8cdLXWknnJjf2MEPX4%3D` },
]