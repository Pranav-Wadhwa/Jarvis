import { useState, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";

interface Assistant {
  uuid: string;
  name: string;
  system_prompt: string;
  voice_id: string | null;
  enabled_tools: string[];
}

function App() {
  const [assistants, setAssistants] = useState<Assistant[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [newAssistantName, setNewAssistantName] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    fetchAssistants();
  }, []);

  const fetchAssistants = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5001/api/assistants");
      if (!res.ok) {
        throw new Error("Failed to fetch assistants");
      }
      const data = await res.json();
      setAssistants(data.assistants || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error fetching assistants:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAssistant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAssistantName.trim()) {
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await fetch("http://localhost:5001/api/assistants", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newAssistantName.trim() }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to create assistant");
      }

      // Reset form and close dialog
      setNewAssistantName("");
      setIsDialogOpen(false);

      // Refresh the assistants list
      await fetchAssistants();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create assistant"
      );
      console.error("Error creating assistant:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-4xl font-light text-gray-900 tracking-tight">
              Assistants
            </h1>
            <Dialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <Dialog.Trigger asChild>
                <button className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 cursor-pointer">
                  Add Assistant
                </button>
              </Dialog.Trigger>
              <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm data-[state=open]:animate-overlayShow" />
                <Dialog.Content className="fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[480px] translate-x-[-50%] translate-y-[-50%] rounded-xl bg-white p-8 shadow-xl focus:outline-none data-[state=open]:animate-contentShow">
                  <Dialog.Title className="text-2xl font-light text-gray-900 mb-6">
                    Add New Assistant
                  </Dialog.Title>
                  <form onSubmit={handleCreateAssistant}>
                    <div className="mb-6">
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700 mb-2.5"
                      >
                        Name
                      </label>
                      <input
                        id="name"
                        type="text"
                        value={newAssistantName}
                        onChange={(e) => setNewAssistantName(e.target.value)}
                        placeholder="Enter assistant name"
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                        required
                        autoFocus
                      />
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                      <Dialog.Close asChild>
                        <button
                          type="button"
                          className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors cursor-pointer disabled:cursor-not-allowed"
                          disabled={isSubmitting}
                        >
                          Cancel
                        </button>
                      </Dialog.Close>
                      <button
                        type="submit"
                        disabled={isSubmitting || !newAssistantName.trim()}
                        className="px-5 py-2.5 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer inline-flex items-center gap-2"
                      >
                        {isSubmitting ? (
                          <>
                            <svg
                              className="animate-spin h-4 w-4 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Creating...
                          </>
                        ) : (
                          "Create"
                        )}
                      </button>
                    </div>
                  </form>
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>
          </div>
          <p className="text-gray-500 text-sm">
            {assistants.length === 0
              ? "Get started by creating your first assistant"
              : `${assistants.length} ${
                  assistants.length === 1 ? "assistant" : "assistants"
                }`}
          </p>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-3">
              <svg
                className="animate-spin h-8 w-8 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <div className="text-gray-400 text-sm">Loading...</div>
            </div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-100 rounded-lg p-4 mb-4">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        ) : assistants.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-gray-300 mb-4">
              <svg
                className="w-16 h-16 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </div>
            <p className="text-gray-500 text-sm mb-6">
              No assistants yet. Create your first one to get started.
            </p>
            <Dialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <Dialog.Trigger asChild>
                <button className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 cursor-pointer">
                  Add Assistant
                </button>
              </Dialog.Trigger>
            </Dialog.Root>
          </div>
        ) : (
          <div className="space-y-2">
            {assistants.map((assistant) => (
              <a
                key={assistant.uuid}
                href={`/assistant/${assistant.uuid}`}
                className="block group"
              >
                <div className="px-6 py-4 rounded-lg border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-all duration-150">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-normal text-gray-900 group-hover:text-gray-950 transition-colors">
                        {assistant.name}
                      </h3>
                      {assistant.voice_id && (
                        <p className="mt-1 text-sm text-gray-500">
                          Voice: {assistant.voice_id}
                        </p>
                      )}
                      {assistant.enabled_tools.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {assistant.enabled_tools.map((tool, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600"
                            >
                              {tool}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      <svg
                        className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
