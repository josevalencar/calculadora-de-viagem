# Calculadora de Custos de Transporte - Terraplanagem

Esta aplicação é uma calculadora de custos de transporte para empresas de terraplanagem, que ajuda a determinar o valor cobrado por viagem de caminhão com base em diversos fatores.

## Funcionalidades

- Cálculo automático de distância usando Google Maps
- Consideração de custos de combustível
- Cálculo de custos com pedágio
- Inclusão de custos operacionais (motorista, seguro, rastreamento)
- Cálculo de lucro personalizável
- Interface moderna e responsiva

## Requisitos

- Node.js 18+ 
- Conta no Google Cloud Platform com API do Maps ativada

## Configuração

1. Clone o repositório
2. Instale as dependências:
   ```bash
   npm install
   ```

3. Crie um arquivo `.env.local` na raiz do projeto e adicione sua chave da API do Google Maps:
   ```
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=sua_chave_aqui
   ```

4. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

5. Acesse a aplicação em `http://localhost:3000`

## Como Usar

1. Digite o endereço da obra
2. Digite o endereço do local de descarte
3. Ajuste os valores de:
   - Preço do diesel
   - Valor do bota fora
   - Indicadores de pedágio e ida/volta
   - Porcentagem de lucro desejada
4. Clique em "Calcular"
5. Visualize o resultado detalhado na aba "Detalhes"

## Tecnologias Utilizadas

- Next.js
- TypeScript
- Tailwind CSS
- Shadcn UI
- Google Maps API

## Estrutura do Projeto

```
src/
  ├── app/              # Páginas da aplicação
  ├── components/       # Componentes React
  ├── constants/        # Constantes e valores padrão
  ├── services/         # Serviços (Google Maps, etc.)
  ├── types/           # Definições de tipos TypeScript
  └── utils/           # Funções utilitárias
```

## Contribuição

Sinta-se à vontade para contribuir com o projeto através de pull requests.

## Licença

Este projeto está sob a licença MIT.
