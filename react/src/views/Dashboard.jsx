import { useEffect, useState } from "react";
import axiosClient from "../axios.js";
import PageComponent from "../components/PageComponent";
import OverviewCards from "../components/analytics/OverviewCards";
import RevenueChart from "../components/analytics/RevenueChart";
import ChannelPerformance from "../components/analytics/ChannelPerformance";
import ProductPerformance from "../components/analytics/ProductPerformance";
import UserRetention from "../components/analytics/UserRetention";
import CustomerSegmentation from "../components/analytics/CustomerSegmentation";
import AIPoweredInsights from "../components/analytics/AIPoweredInsights";
import DashboardCard from "../components/DashboardCard";
import TButton from "../components/core/TButton";
import { EyeIcon, PencilIcon } from "@heroicons/react/24/outline";

export default function CombinedDashboard() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    totalSurveys: 0,
    totalAnswers: 0,
    latestSurvey: null,
    latestAnswers: [],
  });

  useEffect(() => {
    setLoading(true);
    axiosClient
      .get(`/dashboard`)
      .then((res) => {
        setLoading(false);
        setData(res.data);
      })
      .catch((error) => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="flex-1 overflow-auto relative z-10 bg-gray-100">
      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        <OverviewCards />
        <RevenueChart />

        {/* Survey Data 
        <PageComponent title="Survey Overview">
          {loading && <div className="flex justify-center">Loading...</div>}
          {!loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 text-gray-900">
              <DashboardCard
                title="Total Surveys"
                className="order-1 lg:order-2"
                style={{ animationDelay: "0.1s" }}
              >
                <div className="text-8xl pb-4 font-semibold flex-1 flex items-center justify-center">
                  {data.totalSurveys}
                </div>
              </DashboardCard>
              <DashboardCard
                title="Total Answers"
                className="order-2 lg:order-4"
                style={{ animationDelay: "0.2s" }}
              >
                <div className="text-8xl pb-4 font-semibold flex-1 flex items-center justify-center">
                  {data.totalAnswers}
                </div>
              </DashboardCard>
              <DashboardCard
                title="Latest Survey"
                className="order-3 lg:order-1 row-span-2"
                style={{ animationDelay: "0.2s" }}
              >
                {data.latestSurvey ? (
                  <div>
                    <img
                      src={data.latestSurvey.image_url}
                      className="w-[240px] mx-auto"
                    />
                    <h3 className="font-bold text-xl mb-3">
                      {data.latestSurvey.title}
                    </h3>
                    <div className="flex justify-between text-sm mb-1">
                      <div>Create Date:</div>
                      <div>{data.latestSurvey.created_at}</div>
                    </div>
                    <div className="flex justify-between text-sm mb-1">
                      <div>Expire Date:</div>
                      <div>{data.latestSurvey.expire_date}</div>
                    </div>
                    <div className="flex justify-between text-sm mb-1">
                      <div>Status:</div>
                      <div>{data.latestSurvey.status ? "Active" : "Draft"}</div>
                    </div>
                    <div className="flex justify-between text-sm mb-1">
                      <div>Questions:</div>
                      <div>{data.latestSurvey.questions}</div>
                    </div>
                    <div className="flex justify-between text-sm mb-3">
                      <div>Answers:</div>
                      <div>{data.latestSurvey.answers}</div>
                    </div>
                    <div className="flex justify-between">
                      <TButton to={`/surveys/${data.latestSurvey.id}`} link>
                        <PencilIcon className="w-5 h-5 mr-2" />
                        Edit Survey
                      </TButton>
                      <TButton link>
                        <EyeIcon className="w-5 h-5 mr-2" />
                        View Answers
                      </TButton>
                    </div>
                  </div>
                ) : (
                  <div className="text-gray-600 text-center py-16">
                    You don't have surveys yet
                  </div>
                )}
              </DashboardCard>
              <DashboardCard
                title="Latest Answers"
                className="order-4 lg:order-3 row-span-2"
                style={{ animationDelay: "0.3s" }}
              >
                {data.latestAnswers?.length > 0 ? (
                  <div className="text-left">
                    {data.latestAnswers.map((answer) => (
                      <a
                        href="#"
                        key={answer.id}
                        className="block p-2 hover:bg-gray-200"
                      >
                        <div className="font-semibold">
                          {answer.survey.title}
                        </div>
                        <small>
                          Answer Made at:
                          <i className="font-semibold">{answer.end_date}</i>
                        </small>
                      </a>
                    ))}
                  </div>
                ) : (
                  <div className="text-gray-600 text-center py-16">
                    You don't have answers yet
                  </div>
                )}
              </DashboardCard>
            </div>
          )}
        </PageComponent>
        */}

        {/* Analytics Components */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-3">
          <ChannelPerformance />
          <ProductPerformance />
          <UserRetention />
          <CustomerSegmentation />
        </div>

        {/*<AIPoweredInsights /> Si quieres agregar esta parte cambia arriba mb-8 */}
      </main>
    </div>
  );
}
