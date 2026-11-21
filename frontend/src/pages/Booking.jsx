import { useEffect, useState } from "react";

import cinemaService from "@/services/cinema-service";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const Booking = () => {
  const [cinemas, setCinemas] = useState([]);
  const [selectedCinema, setSelectedCinema] = useState("");
  const [groupSize, setGroupSize] = useState("1");
  const [quote, setQuote] = useState(null);
  const [quoteLoading, setQuoteLoading] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCinemas = async () => {
      try {
        const response = await cinemaService.getAll();
        setCinemas(response.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCinemas();
  }, []);

  const handleGenerateQuote = async () => {
    if (!selectedCinema || !groupSize || Number(groupSize) < 1) {
      setError("Please select a cinema and enter a valid group size.");
      return;
    }

    setQuoteLoading(true);
    setError("");
    setQuote(null);

    try {
      const response = await cinemaService.getBookingQuote(
        selectedCinema,
        Number(groupSize),
      );

      setQuote(response.data);
    } catch (error) {
      setError(error.message);
    } finally {
      setQuoteLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Cinema Booking</h1>
        <p className="text-muted-foreground">
          Find the optimal bundle combination for your group.
        </p>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="max-w-md space-y-5">
        <div className="space-y-2">
          <Label htmlFor="cinema">Select Cinema</Label>

          <Select
            value={selectedCinema}
            onValueChange={setSelectedCinema}
            disabled={loading || cinemas.length === 0}
          >
            <SelectTrigger id="cinema" className="w-full cursor-pointer">
              <SelectValue placeholder="Select a cinema">
                {cinemas.find((cinema) => cinema._id === selectedCinema)?.name}
              </SelectValue>
            </SelectTrigger>

            <SelectContent>
              {cinemas.map((cinema) => (
                <SelectItem
                  key={cinema._id}
                  value={cinema._id}
                  className="cursor-pointer"
                >
                  {cinema.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {loading && (
            <p className="text-sm text-muted-foreground">Loading cinemas...</p>
          )}

          {!loading && cinemas.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No cinemas available.
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="groupSize">Group Size</Label>

          <Input
            id="groupSize"
            type="number"
            min="1"
            value={groupSize}
            onChange={(e) => setGroupSize(e.target.value)}
            placeholder="Enter group size"
          />

          <Button
            onClick={handleGenerateQuote}
            disabled={!selectedCinema || !groupSize || quoteLoading}
            size="lg"
            className="cursor-pointer"
          >
            {quoteLoading ? "Generating Quote..." : "Generate Booking Quote"}
          </Button>

          {quote && (
            <div className="max-w-md space-y-4 rounded-lg border bg-white p-5">
              <div>
                <h2 className="text-xl font-semibold">Booking Quote</h2>
                <p className="text-sm text-muted-foreground">
                  {quote.cinema.name}
                </p>
              </div>

              {quote.possible ? (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-md border bg-gray-50 p-3">
                      <p className="text-sm text-muted-foreground">
                        Group Size
                      </p>
                      <p className="text-2xl font-bold">{quote.groupSize}</p>
                    </div>

                    <div className="rounded-md border bg-gray-50 p-3">
                      <p className="text-sm text-muted-foreground">
                        Total Bundles
                      </p>
                      <p className="text-2xl font-bold">{quote.totalBundles}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-medium">Bundles to Buy</h3>

                    {quote.bundles.map((bundle) => (
                      <div
                        key={bundle.size}
                        className="flex items-center justify-between rounded-md border p-3"
                      >
                        <span className="font-medium">
                          {bundle.size}-Seat Bundle
                        </span>

                        <span className="text-sm text-muted-foreground">
                          × {bundle.count}
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="rounded-md border bg-gray-50 p-4">
                  <p className="font-medium text-gray-700">Not Possible</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {quote.message}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Booking;
