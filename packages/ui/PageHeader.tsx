import React from "react";

interface PageHeaderProps {
  title?: string;
  subTitle?: string;
}

const PageHeader = ({ title, subTitle }: PageHeaderProps) => {
  return (
    <div className="mb-4">
      <h1 className="text-2xl font-bold">{title}</h1>
      {subTitle && <div className="text-gray-700">{subTitle}</div>}
    </div>
  );
};

export default PageHeader;
