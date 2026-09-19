# AI/ML Architecture

## Overview
The AI/ML system uses a hybrid approach combining deterministic backend code, machine learning models, and Large Language Models (LLMs) to provide intelligent financial insights while maintaining data accuracy and security.

## Design Principles

### 1. Separation of Concerns
- **Deterministic Code**: Calculations, totals, percentages, database operations
- **Machine Learning**: Expense categorization, anomaly detection, forecasting
- **LLMs**: Natural language explanations, insights, conversational interaction

### 2. Data Security
- LLMs never directly access Firestore
- Backend controls all data access
- LLMs only receive pre-verified, aggregated statistics
- User data never leaves authenticated context

### 3. Accuracy First
- Financial calculations done in backend
- LLMs provide explanations, not calculations
- ML models for pattern recognition
- Human-in-the-loop for critical decisions

## AI Services Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     FastAPI Backend                          │
└────────────────────┬────────────────────────────────────────┘
                     │
        ┌────────────┴────────────┐
        │                         │
        ▼                         ▼
┌──────────────────┐    ┌──────────────────┐
│  ML Services     │    │  LLM Services    │
│                  │    │                  │
│  - Categorizer   │    │  - Insights      │
│  - Anomaly Det.  │    │  - Assistant     │
│  - Forecaster    │    │                  │
└────────┬─────────┘    └────────┬─────────┘
         │                       │
         │                       │
         ▼                       ▼
┌──────────────────┐    ┌──────────────────┐
│  ML Models       │    │  LLM Provider    │
│                  │    │                  │
│  - Classifier    │    │  - Ollama (local)│
│  - Isolation F.  │    │  - Cloud API     │
│  - Regression    │    │                  │
└──────────────────┘    └──────────────────┘
```

## AI Components

### 1. Expense Categorizer

#### Purpose
Automatically categorize expenses based on description, merchant, and amount.

#### Architecture
```
Expense Input
↓
Preprocessing
├── Text cleaning
├── Feature extraction
└── Merchant normalization
↓
Feature Engineering
├── Description embeddings (sentence-transformers)
├── Merchant embeddings
├── Amount features
└── Payment method encoding
↓
ML Classifier
├── Primary: Gradient Boosting / Random Forest
├── Fallback: Rule-based classifier
└── Confidence scoring
↓
Category Prediction
├── Main category
├── Subcategory
└── Confidence score
↓
Firestore Storage
```

#### Features
- **Text Features**: TF-IDF or embeddings from description
- **Merchant Features**: Merchant name embeddings, merchant category
- **Amount Features**: Amount bucket, amount relative to category
- **Payment Method**: One-hot encoded
- **Temporal Features**: Day of week, hour (if available)

#### Models
1. **Primary Model**: Gradient Boosting Classifier
   - High accuracy on structured features
   - Fast inference
   - Explainable feature importance

2. **Fallback Model**: Rule-based Classifier
   - Merchant-based rules (e.g., "Swiggy" → Food)
   - Keyword matching in description
   - Amount-based heuristics

3. **Future Enhancement**: Deep Learning Classifier
   - BERT-based text classification
   - Better semantic understanding
   - Requires more training data

#### Training Data
- Historical user expenses with manual corrections
- Crowdsourced category mappings
- Merchant-category knowledge base
- Synthetically generated examples

#### Continuous Learning
- Store user corrections in Firestore
- Periodic model retraining
- A/B testing for model improvements
- Confidence threshold tuning

#### Output
```python
{
    "category": "Food",
    "subcategory": "Food Delivery",
    "confidence": 0.94,
    "model": "gradient_boosting_v1",
    "features_used": ["description", "merchant", "amount"]
}
```

---

### 2. Anomaly Detector

#### Purpose
Detect unusual spending patterns that deviate from normal behavior.

#### Architecture
```
Expense Data
↓
Feature Extraction
├── Historical statistics (mean, std)
├── Category-specific statistics
├── Merchant frequency
├── Temporal features
└── Transaction frequency
↓
Anomaly Detection
├── Isolation Forest
├── Statistical Z-score
└── Rule-based checks
↓
Anomaly Scoring
├── Composite score
├── Reason generation
└── Severity classification
↓
Firestore Storage
```

#### Features
- **Amount Features**: Relative to historical average, Z-score
- **Category Features**: Category-specific statistics
- **Merchant Features**: Merchant frequency, amount relative to merchant
- **Temporal Features**: Day of week, hour, month
- **Frequency Features**: Transaction frequency in period
- **Context Features**: Payment method, location (if available)

#### Models
1. **Primary Model**: Isolation Forest
   - Unsupervised anomaly detection
   - Handles high-dimensional data
   - No labeled data required
   - Explainable anomaly scores

2. **Secondary Model**: Statistical Methods
   - Z-score analysis
   - IQR (Interquartile Range)
   - Percentile-based thresholds

3. **Rule-based Checks**
   - Amount > 3x historical average
   - New merchant with high amount
   - Unusual time of day
   - Category-specific thresholds

#### Thresholds
- **Low Anomaly**: Score 0.5 - 0.7
- **Medium Anomaly**: Score 0.7 - 0.85
- **High Anomaly**: Score > 0.85

#### Output
```python
{
    "isAnomaly": true,
    "anomalyScore": 0.87,
    "severity": "high",
    "reason": "This transaction is significantly higher than your historical food spending.",
    "features": {
        "amountZScore": 4.2,
        "categoryAverage": 350,
        "categoryStd": 150,
        "merchantFrequency": 0.02
    }
}
```

---

### 3. Expense Forecaster

#### Purpose
Predict future spending based on historical patterns.

#### Architecture
```
Historical Expenses
↓
Data Preprocessing
├── Aggregation by period
├── Seasonal decomposition
├── Trend extraction
└── Outlier removal
↓
Feature Engineering
├── Lag features
├── Rolling statistics
├── Calendar features
└── Category proportions
↓
Forecasting Model
├── Baseline: Linear Regression
├── Advanced: Random Forest / XGBoost
└── Time Series: ARIMA / Prophet
↓
Prediction
├── Point forecast
├── Confidence interval
└── Model selection
↓
Firestore Storage
```

#### Features
- **Temporal Features**: Month, year, season
- **Lag Features**: Previous period spending
- **Rolling Features**: Moving averages, rolling std
- **Trend Features**: Linear trend, polynomial trend
- **Category Features**: Category proportions
- **Calendar Features**: Holidays, weekends count

#### Models
1. **Baseline Model**: Linear Regression
   - Simple, interpretable
   - Good for initial deployment
   - Fast training and inference

2. **Advanced Model**: Random Forest / XGBoost
   - Captures non-linear patterns
   - Handles multiple features
   - Feature importance

3. **Time Series Model**: ARIMA / Prophet
   - Seasonal decomposition
   - Trend and seasonality
   - Confidence intervals

#### Model Selection
- Minimum 3 months of data required
- Use baseline for < 6 months data
- Use advanced model for 6+ months data
- Ensemble multiple models for accuracy

#### Output
```python
{
    "period": "2026-10",
    "predictedAmount": 26100,
    "currency": "INR",
    "confidence": 0.78,
    "confidenceInterval": [24000, 28200],
    "model": "random_forest_v1",
    "features": {
        "previousMonth": 24850,
        "trend": "+5%",
        "seasonality": "+2%"
    }
}
```

---

### 4. AI Insights Generator

#### Purpose
Generate natural language financial insights from verified analytics.

#### Architecture
```
Firestore Data
↓
Analytics Service
├── Calculate statistics
├── Compute comparisons
├── Identify patterns
└── Extract metrics
↓
Verified Data
├── Spending totals
├── Category breakdowns
├── Trends and changes
└── Budget status
↓
LLM Integration
├── Context building
├── Prompt engineering
└── Response generation
↓
Natural Language Insights
```

#### Data Flow
1. **Backend calculates statistics** (totals, percentages, trends)
2. **Extract key metrics** (changes, patterns, anomalies)
3. **Build context** for LLM (verified numbers only)
4. **LLM generates explanations** (natural language)
5. **Return insights** with supporting data

#### Insight Types
1. **Spending Changes**
   - Category-wise increases/decreases
   - Month-over-month comparisons
   - Year-over-year comparisons

2. **Budget Alerts**
   - Approaching budget limits
   - Over-budget categories
   - Budget utilization trends

3. **Pattern Recognition**
   - Spending patterns (weekend vs weekday)
   - Seasonal trends
   - Merchant frequency

4. **Goal Progress**
   - Goal completion progress
   - Required contributions
   - Timeline adjustments

#### LLM Integration
```python
# Context building
context = {
    "period": "September 2026",
    "totalSpent": 24850,
    "foodSpending": 8500,
    "foodPercentage": 34.2,
    "previousMonthFood": 7200,
    "foodChange": 18.1,
    "budgetUsed": 71
}

# Prompt engineering
prompt = f"""
Based on the following financial data:
- Total spent: ₹{context['totalSpent']}
- Food spending: ₹{context['foodSpending']} ({context['foodPercentage']}%)
- Previous month food: ₹{context['previousMonthFood']}
- Food spending change: {context['foodChange']}%
- Budget used: {context['budgetUsed']}%

Generate 2-3 key financial insights for the user.
Keep insights concise and actionable.
"""

# LLM response
insights = llm.generate(prompt)
```

#### Output
```python
{
    "insights": [
        {
            "type": "spending_increase",
            "title": "Food spending increased",
            "description": "Your food spending increased by 18% compared with last month.",
            "category": "Food",
            "priority": "medium",
            "data": {
                "currentMonth": 8500,
                "previousMonth": 7200,
                "change": 18.1
            }
        }
    ]
}
```

---

### 5. AI Financial Assistant

#### Purpose
Answer natural language questions about user's finances.

#### Architecture
```
User Question
↓
Intent Detection
├── Question classification
├── Entity extraction
└── Query type identification
↓
Query Planning
├── Determine data needed
├── Build Firestore query
└── Calculate statistics
↓
Data Retrieval
├── Firestore queries
├── Analytics calculations
└── Data aggregation
↓
Verified Results
├── Actual numbers
├── Calculated metrics
└── Contextual data
↓
LLM Integration
├── Context formatting
├── Prompt construction
└── Response generation
↓
Natural Language Answer
```

#### Intent Detection
```python
INTENTS = {
    "category_spending": "How much did I spend on {category}?",
    "total_spending": "How much did I spend in total?",
    "largest_expense": "What was my biggest expense?",
    "merchant_spending": "How much did I spend at {merchant}?",
    "budget_status": "How much budget do I have left?",
    "goal_progress": "How are my goals progressing?",
    "anomaly_check": "Show my unusual expenses",
    "comparison": "Compare this month with last month"
}
```

#### Query Types
1. **Category Spending**: "How much did I spend on food?"
2. **Total Spending**: "How much did I spend last month?"
3. **Largest Expense**: "What was my biggest expense?"
4. **Merchant Spending**: "How much at Amazon?"
5. **Budget Status**: "Budget remaining?"
6. **Goal Progress**: "Goal progress?"
7. **Anomaly Check**: "Unusual expenses?"
8. **Comparison**: "Compare months"

#### Data Access Control
- Backend verifies Firebase token
- Extracts user ID from token
- Queries only user's data
- LLM never sees raw Firestore data
- LLM only receives aggregated results

#### Example Flow
```python
# User question
question = "How much did I spend on food last month?"

# Intent detection
intent = "category_spending"
entities = {"category": "Food", "period": "last_month"}

# Query planning
query = build_firestore_query(userId, entities)

# Data retrieval
results = analytics_service.get_category_spending(userId, "Food", period)

# Verified results
verified_data = {
    "category": "Food",
    "amount": 8500,
    "transactionCount": 18,
    "percentage": 34.2
}

# LLM integration
prompt = f"""
The user spent ₹{verified_data['amount']} on food last month
across {verified_data['transactionCount']} transactions,
which is {verified_data['percentage']}% of total spending.
Answer the user's question naturally.
"""

answer = llm.generate(prompt)
# "You spent ₹8,500 on food last month across 18 transactions.
#  This represents 34.2% of your total spending."
```

#### Output
```python
{
    "answer": "You spent ₹8,500 on food last month across 18 transactions. This represents 34.2% of your total spending.",
    "queryType": "category_spending",
    "data": {
        "category": "Food",
        "amount": 8500,
        "transactionCount": 18,
        "percentage": 34.2
    }
}
```

---

## LLM Integration

### Providers

#### 1. Ollama (Local - Recommended for Development)
- **Pros**: Free, privacy-focused, no API costs
- **Cons**: Requires local compute, slower inference
- **Models**: Llama3, Mistral, Gemma
- **Setup**: Docker or local installation

#### 2. Cloud LLM APIs (Production)
- **Options**: OpenAI, Anthropic, Google AI, Cohere
- **Pros**: Fast, reliable, state-of-the-art models
- **Cons**: API costs, data sent to external service
- **Models**: GPT-4, Claude 3, Gemini Pro

### Configuration
```python
# Ollama (Local)
LLM_CONFIG = {
    "provider": "ollama",
    "model": "llama3",
    "base_url": "http://localhost:11434",
    "temperature": 0.7
}

# OpenAI (Cloud)
LLM_CONFIG = {
    "provider": "openai",
    "model": "gpt-4",
    "api_key": os.getenv("OPENAI_API_KEY"),
    "temperature": 0.7
}
```

### Prompt Engineering Principles
1. **System Prompts**: Define role and constraints
2. **Context**: Provide verified financial data
3. **Instructions**: Clear, specific instructions
4. **Output Format**: Specify desired format
5. **Safety**: Prevent hallucinations with data constraints

### Example Prompts

#### System Prompt
```
You are a financial assistant. You help users understand their spending patterns.
Always use the provided financial data. Never invent numbers.
Be concise and actionable. Use the user's currency format.
```

#### Insights Prompt
```
Based on this financial data:
{financial_data}

Generate 2-3 key insights about the user's spending.
Focus on actionable recommendations.
```

#### Assistant Prompt
```
User asked: {user_question}

Financial data: {verified_data}

Answer the user's question using only the provided data.
Be natural and conversational.
```

---

## Model Lifecycle

### Training
1. **Data Collection**: Historical expenses, user corrections
2. **Feature Engineering**: Extract relevant features
3. **Model Training**: Train selected models
4. **Validation**: Cross-validation, performance metrics
5. **Testing**: Holdout test set evaluation

### Deployment
1. **Model Serialization**: Save trained models
2. **Version Control**: Track model versions
3. **API Integration**: Integrate with FastAPI
4. **Monitoring**: Track prediction quality
5. **Rollback**: Ability to revert if needed

### Monitoring
1. **Prediction Accuracy**: Track categorization accuracy
2. **Anomaly Feedback**: User acknowledgment rates
3. **Forecast Accuracy**: Compare predictions vs actual
4. **User Feedback**: Collect corrections and ratings
5. **Performance**: Inference time, resource usage

### Retraining
1. **Schedule**: Monthly or quarterly retraining
2. **Trigger**: Performance degradation threshold
3. **Data Update**: Include new user corrections
4. **A/B Testing**: Test new models before rollout
5. **Gradual Rollout**: Phased deployment

---

## Data Pipeline

### Feature Pipeline
```
Raw Expenses
↓
Feature Extraction
├── Text features
├── Numerical features
├── Categorical features
└── Temporal features
↓
Feature Store
├── Training features
├── Inference features
└── Feature versioning
↓
ML Models
```

### Prediction Pipeline
```
New Expense
↓
Feature Extraction
↓
Model Inference
├── Categorization
├── Anomaly Detection
└── Forecasting
↓
Result Storage
├── Expense update
├── Anomaly record
└── Forecast record
```

### Feedback Pipeline
```
User Action
↓
Feedback Collection
├── Category corrections
├── Anomaly acknowledgment
└── Insight ratings
↓
Label Storage
├── Firestore
└── Training data
↓
Model Retraining
```

---

## Performance Considerations

### Caching
- Cache category predictions for common merchants
- Cache anomaly detection thresholds
- Cache forecast results for same period

### Batch Processing
- Batch expense categorization for CSV imports
- Batch anomaly detection for historical data
- Batch forecast generation for multiple periods

### Async Processing
- Async ML model inference
- Async LLM API calls
- Background job for heavy computations

### Model Optimization
- Model quantization for faster inference
- Feature selection to reduce dimensionality
- Model pruning for smaller size

---

## Ethics and Privacy

### Data Privacy
- User data never shared with LLM providers (aggregated only)
- No PII in ML features
- Federated learning consideration for future

### Fairness
- Monitor for bias in categorization
- Ensure anomaly detection doesn't flag cultural differences
- Regular audits of model predictions

### Transparency
- Show confidence scores for predictions
- Explain anomaly reasons
- Allow users to override AI decisions

### User Control
- Users can disable AI features
- Users can correct AI predictions
- Users can provide feedback on insights

---

## Future Enhancements

### Advanced ML
- Deep learning for categorization
- Reinforcement learning for budget recommendations
- Graph neural networks for merchant relationships
- Ensemble methods for improved accuracy

### Personalization
- User-specific models
- Adaptive thresholds
- Personalized insights
- Custom anomaly baselines

### Real-time
- Real-time anomaly detection
- Streaming analytics
- Instant insights
- Live forecasting

### Integration
- Bank account integration
- Transaction sync
- Automatic categorization
- Real-time alerts
