<!--
Sync Impact Report
- Version change: template -> 1.0.0
- Modified principles:
	- Principle 1 (template) -> 一、繁體中文優先
	- Principle 2 (template) -> 二、簡潔與避免過度設計
	- Principle 3 (template) -> 三、TDD 優先（不可妥協）
	- Principle 4 (template) -> 四、Git 階段化驗證
	- Principle 5 (template) -> 五、規格可追溯與實作保護
- Added sections:
	- 專案技術與範圍約束
	- 開發流程與品質關卡
- Removed sections:
	- 無
- Templates requiring updates:
	- ✅ updated: .specify/templates/plan-template.md
	- ✅ updated: .specify/templates/spec-template.md
	- ✅ updated: .specify/templates/tasks-template.md
	- ⚠ pending: .specify/templates/commands/*.md (目錄不存在，無需更新)
- Follow-up TODOs:
	- 無
-->

# Oooooooooooo Constitution

## Core Principles

### 一、繁體中文優先
所有規格文件、計畫文件、任務文件與代理回覆 MUST 使用繁體中文撰寫。
若引用外部英文術語，可保留原文，但核心敘述與決策依據 MUST 為繁體中文。
理由：確保團隊溝通一致，避免需求解讀偏差。

### 二、簡潔與避免過度設計
設計與實作 MUST 以可交付最小價值為優先，禁止預先實作未被需求明確要求的抽象層。
每個新增結構、依賴或流程都 MUST 說明直接需求對應。
理由：降低維護成本，提升交付速度與可驗證性。

### 三、TDD 優先（不可妥協）
所有功能開發 MUST 遵守 Red-Green-Refactor：先寫測試、確認測試失敗，再進行實作。
任何 implement 階段任務，若未先有對應失敗測試，不得開始功能程式碼。
理由：以可執行規格約束行為，降低回歸風險。

### 四、Git 階段化驗證
每個階段（specify、plan、tasks、implement）完成時 MUST 執行 Git 狀態檢查，至少確認
變更檔案與預期一致，避免跨階段污染。
若發現非預期檔案變更 MUST 先釐清來源再繼續。
理由：維持變更可追蹤性與審查品質。

### 五、規格可追溯與實作保護
implement 階段 MUST 勾選 `tasks.md` 已完成項目，且不得刪除或覆蓋既有規格文件
（尤其 `spec.md`、`plan.md`、`tasks.md` 與本憲章）。
若專案為網站類型，預設 MUST 採可部署於 GitHub Pages 的前端靜態網站方案，除非需求另有明示。
理由：確保交付過程透明且規格資產持續有效。

## 專案技術與範圍約束

- 預設優先採用簡單、可直接部署的技術組合，避免引入非必要後端服務。
- 網站專案若無特殊需求，目標部署平台為 GitHub Pages。
- 需求未要求時，不新增額外 Markdown 報告檔記錄變更摘要。

## 開發流程與品質關卡

1. `speckit.specify`：先產出繁體中文規格並確認範圍。
2. `speckit.plan`：以不過度設計原則決定架構，列出可驗證技術決策。
3. `speckit.tasks`：任務需可對應 user story，並包含測試先行工作。
4. `speckit.implement`：先跑失敗測試再實作，完成任務需即時勾選 `tasks.md`。
5. 每階段結束都要執行 Git 檢查，確認規格檔未被誤刪或覆蓋。

## Governance

本憲章優先於其他慣例與臨時流程。Code review 與任務驗收 MUST 檢查以下事項：
- 是否遵守繁體中文、簡潔設計與 TDD。
- 是否在每階段做 Git 狀態驗證。
- implement 過程是否正確維護 `tasks.md` 勾選與規格檔完整性。

修訂流程：
1. 於 PR 或任務中提出修訂理由、影響範圍與版本升級類型。
2. 經維護者審核通過後更新版本與日期。
3. 同步檢查 `.specify/templates/` 下相依模板是否一致。

版本政策（SemVer）：
- MAJOR：移除或重定義核心原則，造成流程不相容。
- MINOR：新增原則或新增強制章節。
- PATCH：措辭澄清、排版或不改變治理語意的調整。

合規檢查期望：每次 `speckit` 流程執行至少做一次憲章對照；若有違反，必須在計畫或任務中明確記錄
理由與補救措施。

**Version**: 1.0.0 | **Ratified**: 2026-03-06 | **Last Amended**: 2026-03-06
