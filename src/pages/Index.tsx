import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

interface Medication {
  id: string;
  name: string;
  dosage: string;
  quantity: number;
  category: string;
  pricePerPack: number;
}

interface DrugInteraction {
  drug1: string;
  drug2: string;
  severity: 'low' | 'medium' | 'high';
  description: string;
}

const medicationDatabase = [
  { name: 'Аспирин', category: 'Антиагрегант', commonDosage: '100 мг', pricePerPack: 120 },
  { name: 'Клопидогрел', category: 'Антиагрегант', commonDosage: '75 мг', pricePerPack: 450 },
  { name: 'Аторвастатин', category: 'Статин', commonDosage: '20 мг', pricePerPack: 350 },
  { name: 'Розувастатин', category: 'Статин', commonDosage: '10 мг', pricePerPack: 380 },
  { name: 'Симвастатин', category: 'Статин', commonDosage: '20 мг', pricePerPack: 280 },
  { name: 'Лизиноприл', category: 'Ингибитор АПФ', commonDosage: '10 мг', pricePerPack: 180 },
  { name: 'Эналаприл', category: 'Ингибитор АПФ', commonDosage: '10 мг', pricePerPack: 150 },
  { name: 'Периндоприл', category: 'Ингибитор АПФ', commonDosage: '5 мг', pricePerPack: 320 },
  { name: 'Метформин', category: 'Гипогликемическое', commonDosage: '500 мг', pricePerPack: 220 },
  { name: 'Глибенкламид', category: 'Гипогликемическое', commonDosage: '5 мг', pricePerPack: 180 },
  { name: 'Гликлазид', category: 'Гипогликемическое', commonDosage: '30 мг', pricePerPack: 240 },
  { name: 'Амлодипин', category: 'Блокатор кальциевых каналов', commonDosage: '5 мг', pricePerPack: 160 },
  { name: 'Нифедипин', category: 'Блокатор кальциевых каналов', commonDosage: '10 мг', pricePerPack: 170 },
  { name: 'Метопролол', category: 'Бета-блокатор', commonDosage: '50 мг', pricePerPack: 140 },
  { name: 'Бисопролол', category: 'Бета-блокатор', commonDosage: '5 мг', pricePerPack: 160 },
  { name: 'Карведилол', category: 'Бета-блокатор', commonDosage: '12.5 мг', pricePerPack: 200 },
  { name: 'Омепразол', category: 'Ингибитор протонной помпы', commonDosage: '20 мг', pricePerPack: 190 },
  { name: 'Пантопразол', category: 'Ингибитор протонной помпы', commonDosage: '20 мг', pricePerPack: 210 },
  { name: 'Варфарин', category: 'Антикоагулянт', commonDosage: '5 мг', pricePerPack: 280 },
  { name: 'Дабигатран', category: 'Антикоагулянт', commonDosage: '110 мг', pricePerPack: 1200 },
  { name: 'Лозартан', category: 'Блокатор рецепторов ангиотензина', commonDosage: '50 мг', pricePerPack: 220 },
  { name: 'Валсартан', category: 'Блокатор рецепторов ангиотензина', commonDosage: '80 мг', pricePerPack: 340 },
  { name: 'Фуросемид', category: 'Диуретик', commonDosage: '40 мг', pricePerPack: 90 },
  { name: 'Гидрохлоротиазид', category: 'Диуретик', commonDosage: '25 мг', pricePerPack: 110 },
  { name: 'Индапамид', category: 'Диуретик', commonDosage: '2.5 мг', pricePerPack: 130 },
  { name: 'Левотироксин', category: 'Гормон щитовидной железы', commonDosage: '100 мкг', pricePerPack: 180 },
  { name: 'Преднизолон', category: 'Глюкокортикостероид', commonDosage: '5 мг', pricePerPack: 160 },
  { name: 'Амоксициллин', category: 'Антибиотик', commonDosage: '500 мг', pricePerPack: 250 },
];

const promoCodes = {
  'HEALTH10': { discount: 10, description: 'Скидка 10%' },
  'FIRST20': { discount: 20, description: 'Скидка 20% на первый заказ' },
  'SAVE15': { discount: 15, description: 'Скидка 15%' },
};

const drugInteractions: DrugInteraction[] = [
  {
    drug1: 'Аспирин',
    drug2: 'Варфарин',
    severity: 'high',
    description: 'Повышенный риск кровотечений при совместном приеме',
  },
  {
    drug1: 'Метопролол',
    drug2: 'Амлодипин',
    severity: 'medium',
    description: 'Возможна избыточная гипотензия, требуется контроль давления',
  },
  {
    drug1: 'Омепразол',
    drug2: 'Варфарин',
    severity: 'medium',
    description: 'Омепразол может усилить действие варфарина',
  },
  {
    drug1: 'Лизиноприл',
    drug2: 'Амлодипин',
    severity: 'low',
    description: 'Комбинация часто используется, но требует мониторинга давления',
  },
];

const Index = () => {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [selectedDrug, setSelectedDrug] = useState('');
  const [dosage, setDosage] = useState('');
  const [quantity, setQuantity] = useState('30');
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<{discount: number, description: string} | null>(null);

  const generateOrderNumber = () => {
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `ORD-${timestamp}-${random}`;
  };

  const addMedication = () => {
    if (!selectedDrug || !dosage) {
      toast.error('Выберите препарат и укажите дозировку');
      return;
    }

    const drugInfo = medicationDatabase.find(d => d.name === selectedDrug);
    if (!drugInfo) return;

    const newMed: Medication = {
      id: Date.now().toString(),
      name: selectedDrug,
      dosage,
      quantity: parseInt(quantity),
      category: drugInfo.category,
      pricePerPack: drugInfo.pricePerPack,
    };

    setMedications([...medications, newMed]);
    setSelectedDrug('');
    setDosage('');
    toast.success('Препарат добавлен в состав');
  };

  const removeMedication = (id: string) => {
    setMedications(medications.filter(m => m.id !== id));
    toast.info('Препарат удален из состава');
  };

  const applyPromoCode = () => {
    const promo = promoCodes[promoCode.toUpperCase() as keyof typeof promoCodes];
    if (promo) {
      setAppliedPromo(promo);
      toast.success(`Промокод применен! ${promo.description}`);
    } else {
      toast.error('Неверный промокод');
    }
  };

  const calculateTotal = () => {
    const subtotal = medications.reduce((total, med) => total + med.pricePerPack, 0);
    if (appliedPromo) {
      return subtotal - (subtotal * appliedPromo.discount / 100);
    }
    return subtotal;
  };

  const checkInteractions = () => {
    const interactions: DrugInteraction[] = [];
    
    for (let i = 0; i < medications.length; i++) {
      for (let j = i + 1; j < medications.length; j++) {
        const interaction = drugInteractions.find(
          int => 
            (int.drug1 === medications[i].name && int.drug2 === medications[j].name) ||
            (int.drug2 === medications[i].name && int.drug1 === medications[j].name)
        );
        if (interaction) {
          interactions.push(interaction);
        }
      }
    }
    
    return interactions;
  };

  const interactions = checkInteractions();

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800 border-red-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'low': return 'bg-green-100 text-green-800 border-green-300';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high': return 'AlertTriangle';
      case 'medium': return 'AlertCircle';
      case 'low': return 'Info';
      default: return 'Info';
    }
  };

  const getSeverityText = (severity: string) => {
    switch (severity) {
      case 'high': return 'Высокий риск';
      case 'medium': return 'Средний риск';
      case 'low': return 'Низкий риск';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex-1"></div>
          <div className="text-center flex-1">
            <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-3">
              <Icon name="Pill" size={40} className="text-primary" />
              Конструктор Полипилюли
            </h1>
            <p className="text-gray-600 text-lg">
              Создайте персонализированную комбинацию препаратов с проверкой совместимости
            </p>
          </div>
          <div className="flex-1 flex justify-end gap-3">
            <Button variant="outline" size="icon" className="h-12 w-12">
              <Icon name="ShoppingCart" size={24} />
            </Button>
            <Button variant="outline" size="icon" className="h-12 w-12">
              <Icon name="Package" size={24} />
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="shadow-lg border-2">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-green-50">
              <CardTitle className="flex items-center gap-2">
                <Icon name="Plus" size={24} className="text-primary" />
                Добавить препарат
              </CardTitle>
              <CardDescription>
                Выберите лекарство и укажите дозировку
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="space-y-2">
                <Label htmlFor="drug">Препарат</Label>
                <Select value={selectedDrug} onValueChange={setSelectedDrug}>
                  <SelectTrigger id="drug">
                    <SelectValue placeholder="Выберите препарат" />
                  </SelectTrigger>
                  <SelectContent>
                    {medicationDatabase.map((drug) => (
                      <SelectItem key={drug.name} value={drug.name}>
                        <div className="flex flex-col items-start">
                          <span className="font-medium">{drug.name}</span>
                          <span className="text-xs text-gray-500">{drug.category}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dosage">Дозировка</Label>
                <Input
                  id="dosage"
                  placeholder="Например: 100 мг"
                  value={dosage}
                  onChange={(e) => setDosage(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity">Количество таблеток</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>

              <Button 
                onClick={addMedication} 
                className="w-full"
                size="lg"
              >
                <Icon name="Plus" size={20} className="mr-2" />
                Добавить в состав
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-2">
            <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50">
              <CardTitle className="flex items-center gap-2">
                <Icon name="Package" size={24} className="text-secondary" />
                Состав полипилюли
              </CardTitle>
              <CardDescription>
                {medications.length} препарат(ов) в составе
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              {medications.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Icon name="PackageOpen" size={48} className="mx-auto mb-3 opacity-50" />
                  <p>Состав пуст</p>
                  <p className="text-sm">Добавьте препараты для создания полипилюли</p>
                </div>
              ) : (
                <>
                  <div className="space-y-3 mb-4">
                    {medications.map((med) => (
                      <div
                        key={med.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border hover:border-primary transition-all"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-gray-900">{med.name}</h4>
                            <Badge variant="outline" className="text-xs">
                              {med.category}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {med.dosage} • {med.quantity} таб.
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-900">{med.pricePerPack}₽</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeMedication(med.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Icon name="Trash2" size={18} />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mb-4 space-y-3">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Введите промокод"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        className="flex-1"
                      />
                      <Button 
                        onClick={applyPromoCode}
                        variant="outline"
                        disabled={!promoCode || appliedPromo !== null}
                      >
                        <Icon name="Tag" size={18} className="mr-2" />
                        Применить
                      </Button>
                    </div>
                    {appliedPromo && (
                      <Alert className="bg-green-50 border-green-200">
                        <Icon name="CheckCircle" size={18} className="text-green-600" />
                        <AlertDescription className="text-green-700">
                          Промокод применен: {appliedPromo.description}
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>

                  <div className="mb-4 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border-2 border-primary/20">
                    {appliedPromo ? (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-gray-600">
                          <span>Сумма:</span>
                          <span>{medications.reduce((total, med) => total + med.pricePerPack, 0)}₽</span>
                        </div>
                        <div className="flex items-center justify-between text-green-600">
                          <span>Скидка ({appliedPromo.discount}%):</span>
                          <span>-{Math.round(medications.reduce((total, med) => total + med.pricePerPack, 0) * appliedPromo.discount / 100)}₽</span>
                        </div>
                        <div className="flex items-center justify-between border-t pt-2">
                          <div className="flex items-center gap-2">
                            <Icon name="Wallet" size={24} className="text-secondary" />
                            <span className="text-lg font-semibold text-gray-700">К оплате:</span>
                          </div>
                          <span className="text-2xl font-bold text-primary">
                            {Math.round(calculateTotal())}₽
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Icon name="Wallet" size={24} className="text-secondary" />
                          <span className="text-lg font-semibold text-gray-700">Общая стоимость:</span>
                        </div>
                        <span className="text-2xl font-bold text-primary">
                          {medications.reduce((total, med) => total + med.pricePerPack, 0)}₽
                        </span>
                      </div>
                    )}
                  </div>
                  <Button 
                    className="w-full"
                    size="lg"
                    onClick={() => {
                      const orderNumber = generateOrderNumber();
                      const totalPrice = Math.round(calculateTotal());
                      const savings = appliedPromo 
                        ? Math.round(medications.reduce((total, med) => total + med.pricePerPack, 0) * appliedPromo.discount / 100)
                        : 0;
                      const message = savings 
                        ? `Заказ оформлен! Номер: ${orderNumber}. К оплате: ${totalPrice}₽ (экономия: ${savings}₽)`
                        : `Заказ оформлен! Номер: ${orderNumber}. Сумма: ${totalPrice}₽`;
                      toast.success(message, {
                        duration: 6000,
                      });
                    }}
                  >
                    <Icon name="ShoppingCart" size={20} className="mr-2" />
                    Оформить заказ
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {medications.length > 0 && (
          <Card className="mt-6 shadow-lg border-2">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50">
              <CardTitle className="flex items-center gap-2">
                <Icon name="Shield" size={24} className="text-purple-600" />
                Проверка совместимости
              </CardTitle>
              <CardDescription>
                Автоматический анализ взаимодействий между препаратами
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              {interactions.length === 0 ? (
                <Alert className="bg-green-50 border-green-200">
                  <Icon name="CheckCircle2" size={20} className="text-green-600" />
                  <AlertDescription className="text-green-800 ml-2">
                    <strong>Отлично!</strong> Значимых взаимодействий между выбранными препаратами не обнаружено.
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-4">
                  {interactions.map((interaction, idx) => (
                    <Alert 
                      key={idx} 
                      className={`${getSeverityColor(interaction.severity)} border-2`}
                    >
                      <div className="flex items-start gap-3">
                        <Icon 
                          name={getSeverityIcon(interaction.severity)} 
                          size={20} 
                        />
                        <div className="flex-1">
                          <div className="font-semibold mb-1 flex items-center gap-2">
                            <span>{interaction.drug1}</span>
                            <Icon name="ArrowRight" size={16} />
                            <span>{interaction.drug2}</span>
                            <Badge className={getSeverityColor(interaction.severity)}>
                              {getSeverityText(interaction.severity)}
                            </Badge>
                          </div>
                          <AlertDescription className="text-sm">
                            {interaction.description}
                          </AlertDescription>
                        </div>
                      </div>
                    </Alert>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {medications.length > 0 && (
          <Card className="mt-6 shadow-lg border-2 bg-gradient-to-br from-blue-50 to-green-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="FileText" size={24} className="text-primary" />
                Итоговая формула
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-white rounded-lg p-6 border-2 border-primary/20">
                <div className="grid md:grid-cols-2 gap-4">
                  {medications.map((med) => (
                    <div key={med.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <Icon name="Pill" size={20} className="text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{med.name}</p>
                        <p className="text-sm text-gray-600">{med.dosage}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    <strong>Курс:</strong> {quantity} дней
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    <strong>Всего препаратов:</strong> {medications.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="mt-6 shadow-lg border-2 border-blue-100">
          <CardHeader className="bg-blue-50">
            <CardTitle className="flex items-center gap-2">
              <Icon name="BookOpen" size={24} className="text-blue-600" />
              База препаратов
            </CardTitle>
            <CardDescription>
              Доступные препараты и их характеристики
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {medicationDatabase.map((drug) => (
                <div
                  key={drug.name}
                  className="p-4 bg-gray-50 rounded-lg border hover:border-blue-300 transition-all hover:shadow-md"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">{drug.name}</h4>
                    <Icon name="Pill" size={18} className="text-blue-500" />
                  </div>
                  <Badge variant="secondary" className="mb-2 text-xs">
                    {drug.category}
                  </Badge>
                  <p className="text-sm text-gray-600">
                    Обычная доза: {drug.commonDosage}
                  </p>
                  <p className="text-sm font-semibold text-blue-600 mt-2">
                    {drug.pricePerPack} ₽ / упаковка
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;