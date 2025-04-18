"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalculationInputs, CostCalculation, Location, RouteInfo } from "@/types";
import { DEFAULT_VALUES, DEFAULT_PROFIT_PERCENTAGE, WORKING_HOURS_PER_MONTH } from "@/constants/defaults";
import { calculateCosts } from "@/utils/calculations";
import { MapsService } from "@/services/maps";
import { MapView } from "./map-view";
import { AddressAutocomplete } from "./address-autocomplete";
import { SiteHeader } from "./site-header";

export function Calculator() {
  const [workAddress, setWorkAddress] = useState("");
  const [disposalAddress, setDisposalAddress] = useState("");
  const [workLocation, setWorkLocation] = useState<Location | null>(null);
  const [disposalLocation, setDisposalLocation] = useState<Location | null>(null);
  const [dieselPrice, setDieselPrice] = useState(DEFAULT_VALUES.dieselPrice);
  const [disposalPrice, setDisposalPrice] = useState(DEFAULT_VALUES.disposalPrice);
  const [hasToll, setHasToll] = useState(false);
  const [roundTrip, setRoundTrip] = useState(true);
  const [profitPercentage, setProfitPercentage] = useState(DEFAULT_PROFIT_PERCENTAGE);
  const [calculation, setCalculation] = useState<CostCalculation | null>(null);
  const [routeInfo, setRouteInfo] = useState<RouteInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mapVisible, setMapVisible] = useState(false);

  const handleCalculate = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!workLocation || !disposalLocation) {
        setError("Por favor, selecione endereços válidos");
        return;
      }

      // Get route information
      const mapsService = await MapsService.getInstance();
      const route = await mapsService.getRouteInfo(workLocation.coordinates, disposalLocation.coordinates);
      setRouteInfo(route);
      setMapVisible(true);

      // Prepare calculation inputs
      const inputs: CalculationInputs = {
        workLocation,
        disposalLocation,
        dieselPrice,
        disposalPrice,
        hasToll,
        roundTrip,
        profitPercentage,
      };

      // Calculate costs
      const result = calculateCosts(inputs, route);
      setCalculation(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const renderCostBreakdown = () => {
    if (!calculation) return null;

    const driverHourlyRate = DEFAULT_VALUES.driverSalary / WORKING_HOURS_PER_MONTH;
    const trackingCostPerTrip = (DEFAULT_VALUES.trackingMonthly + DEFAULT_VALUES.semPararMonthly + DEFAULT_VALUES.insuranceMonthly) / (DEFAULT_VALUES.averageTripsPerDay * 30);
    const generalExpensesPerTrip = DEFAULT_VALUES.generalExpenses / (DEFAULT_VALUES.averageTripsPerDay * 30);

    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <h3 className="font-semibold">Detalhamento dos Custos:</h3>
          
          <div className="space-y-1">
            <p className="text-sm text-gray-600">Custo do Motorista:</p>
            <p className="text-sm">Salário mensal: R$ {DEFAULT_VALUES.driverSalary.toFixed(2)}</p>
            <p className="text-sm">Horas trabalhadas por mês: {WORKING_HOURS_PER_MONTH}h</p>
            <p className="text-sm">Valor por hora: R$ {driverHourlyRate.toFixed(2)}</p>
            <p className="text-sm">Tempo da viagem: {routeInfo?.duration.toFixed(0)} minutos</p>
            <p className="text-sm font-medium">Custo total do motorista: R$ {calculation.driverHourlyCost.toFixed(2)}</p>
          </div>

          <div className="space-y-1">
            <p className="text-sm text-gray-600">Rastreamento e Seguro:</p>
            <p className="text-sm">Rastreamento mensal: R$ {DEFAULT_VALUES.trackingMonthly.toFixed(2)}</p>
            <p className="text-sm">Sem Parar mensal: R$ {DEFAULT_VALUES.semPararMonthly.toFixed(2)}</p>
            <p className="text-sm">Seguro mensal: R$ {DEFAULT_VALUES.insuranceMonthly.toFixed(2)}</p>
            <p className="text-sm">Viagens por dia: {DEFAULT_VALUES.averageTripsPerDay}</p>
            <p className="text-sm font-medium">Custo por viagem: R$ {trackingCostPerTrip.toFixed(2)}</p>
          </div>

          <div className="space-y-1">
            <p className="text-sm text-gray-600">Despesas Gerais:</p>
            <p className="text-sm">Despesas mensais: R$ {DEFAULT_VALUES.generalExpenses.toFixed(2)}</p>
            <p className="text-sm">Viagens por dia: {DEFAULT_VALUES.averageTripsPerDay}</p>
            <p className="text-sm font-medium">Custo por viagem: R$ {generalExpensesPerTrip.toFixed(2)}</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <SiteHeader />
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Calculadora de Viagens</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AddressAutocomplete
                  id="workAddress"
                  label="Local da Obra"
                  placeholder="Digite o endereço da obra"
                  value={workAddress}
                  onChange={setWorkLocation}
                  onInputChange={setWorkAddress}
                />
                <AddressAutocomplete
                  id="disposalAddress"
                  label="Local de Descarte"
                  placeholder="Digite o endereço do local de descarte"
                  value={disposalAddress}
                  onChange={setDisposalLocation}
                  onInputChange={setDisposalAddress}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dieselPrice">Preço do Diesel (R$)</Label>
                  <Input
                    id="dieselPrice"
                    type="number"
                    step="0.01"
                    value={dieselPrice}
                    onChange={(e) => setDieselPrice(Number(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="disposalPrice">Valor do Bota Fora (R$)</Label>
                  <Input
                    id="disposalPrice"
                    type="number"
                    step="0.01"
                    value={disposalPrice}
                    onChange={(e) => setDisposalPrice(Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="hasToll"
                    checked={hasToll}
                    onCheckedChange={setHasToll}
                  />
                  <Label htmlFor="hasToll">Tem Pedágio</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="roundTrip"
                    checked={roundTrip}
                    onCheckedChange={setRoundTrip}
                  />
                  <Label htmlFor="roundTrip">Ida e Volta (caminhão volta vazio)</Label>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Porcentagem de Lucro: {profitPercentage}%</Label>
                <Slider
                  value={[profitPercentage]}
                  onValueChange={([value]) => setProfitPercentage(value)}
                  min={0}
                  max={100}
                  step={1}
                />
              </div>

              <Button
                onClick={handleCalculate}
                disabled={loading || !workLocation || !disposalLocation}
                className="w-full"
              >
                {loading ? "Calculando..." : "Calcular"}
              </Button>

              {error && (
                <div className="text-red-500 text-center">{error}</div>
              )}

              {routeInfo && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold mb-2">Informações da Rota:</h3>
                  <p>Distância: {routeInfo.distance.toFixed(1)} km</p>
                  <p>Tempo estimado: {routeInfo.duration.toFixed(0)} minutos</p>
                  <p>Pedágio na rota: {routeInfo.hasToll ? "Sim" : "Não"}</p>
                </div>
              )}

              {routeInfo && calculation && (
                <div className="mt-4">
                  <MapView
                    workLocation={calculation.workLocation}
                    disposalLocation={calculation.disposalLocation}
                    routeInfo={routeInfo}
                  />
                </div>
              )}

              {calculation && (
                <Tabs defaultValue="summary" className="mt-4">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="summary">Resumo</TabsTrigger>
                    <TabsTrigger value="details">Detalhes</TabsTrigger>
                    <TabsTrigger value="breakdown">Análise de Custos</TabsTrigger>
                  </TabsList>
                  <TabsContent value="summary">
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-2xl font-bold text-center">
                          Valor Total por Viagem: R$ {calculation.totalCost.toFixed(2)}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  <TabsContent value="details">
                    <Card>
                      <CardContent className="pt-6">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>Combustível:</span>
                            <span>R$ {calculation.fuelCost.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Descarte:</span>
                            <span>R$ {calculation.disposalCost.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Pedágio:</span>
                            <span>R$ {calculation.tollCost.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Custo do Motorista:</span>
                            <span>R$ {calculation.driverHourlyCost.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Comissão do Motorista:</span>
                            <span>R$ {calculation.driverCommission.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Rastreamento e Seguro:</span>
                            <span>R$ {calculation.trackingCost.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Despesas Gerais:</span>
                            <span>R$ {calculation.generalExpenses.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between font-bold">
                            <span>Lucro ({profitPercentage}%):</span>
                            <span>R$ {calculation.profit.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-xl font-bold mt-4">
                            <span>Total:</span>
                            <span>R$ {calculation.totalCost.toFixed(2)}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  <TabsContent value="breakdown">
                    <Card>
                      <CardContent className="pt-6">
                        {renderCostBreakdown()}
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
} 