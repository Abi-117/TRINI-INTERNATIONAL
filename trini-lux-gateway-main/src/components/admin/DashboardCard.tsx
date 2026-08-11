interface Props {
  title: string;
  value: number | string;
}

const DashboardCard = ({ title, value }: Props) => {
  return (
    <div className="rounded-xl bg-white p-6 shadow">
      <h3 className="text-gray-500">{title}</h3>

      <p className="mt-3 text-3xl font-bold">
        {value}
      </p>
    </div>
  );
};

export default DashboardCard;