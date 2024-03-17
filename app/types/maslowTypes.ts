export type MaslowCriteria = {
  title: string;
  description: string;
};

export type MaslowCategory = {
  categoryName: string;
  criteria: MaslowCriteria[];
};

export type MaslowsNeedsType = {
  needName: string;
  description: string;
  categories: MaslowCategory[];
};
