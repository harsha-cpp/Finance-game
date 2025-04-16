import { useGameContext } from "@/contexts/GameContext";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function MentorInsights() {
  const { state } = useGameContext();
  
  // Get latest mentor advice, sorted by date
  const latestAdvice = [...state.mentorAdvice]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-200 mb-6">
      <div className="flex items-start">
        <div className="flex-shrink-0 bg-primary-100 rounded-full p-2">
          <i className="fa-solid fa-robot text-primary-600 text-xl"></i>
        </div>
        <div className="ml-4">
          <h2 className="font-heading font-semibold text-lg text-gray-900">AI Mentor Insights</h2>
          
          {latestAdvice.length > 0 ? (
            <>
              <p className="text-gray-600 mt-2">Based on your current business performance, here are strategic recommendations:</p>
              
              <ul className="mt-3 space-y-3">
                {latestAdvice.map((advice) => (
                  <li key={advice.id} className="flex">
                    <i className="fa-solid fa-lightbulb text-warning-500 mt-0.5 mr-2"></i>
                    <div>
                      <h4 className="font-medium text-gray-900">{advice.title}</h4>
                      <p className="text-sm text-gray-600">{advice.content}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <div className="text-gray-600 mt-2">
              <p>No mentor insights available yet. As your business grows, the AI mentor will provide strategic advice based on your company's performance.</p>
              <p className="mt-2">Check back after making a few business decisions.</p>
            </div>
          )}
          
          <div className="mt-4">
            <Link href="/mentor">
              <Button 
                variant="link" 
                className="text-primary-600 hover:text-primary-800 font-medium text-sm p-0"
              >
                Get detailed analysis <i className="fa-solid fa-arrow-right ml-1"></i>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
