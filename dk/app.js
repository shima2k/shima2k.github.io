const API_URL = "https://script.google.com/macros/s/AKfycbwlfzJDLY7lyYw61brsj4HuKrcFI6bl9ZeseVCx057xq7_VekH2RHo1Ev6j4jRTzzd8eQ/exec";

const activities = [
  { id: "dung-trai", apiId: "dung-trai", icon: "🏕️", name: "Dựng trại", hint: "Đăng ký đội / chi đoàn" },
  { id: "cam-hoa", apiId: "cam-hoa", icon: "💐", name: "Cắm hoa", hint: "Tối thiểu 3 người" },
  { id: "keo-co", apiId: "keo-co", icon: "💪", name: "Kéo co", hint: "4 nam + 4 nữ" },
  { id: "nhay-bao-bo", apiId: "nhay-bao-bo", icon: "🏃", name: "Nhảy bao bố", hint: "2 nam + 2 nữ" },
  { id: "chuyen-nuoc", apiId: "chuyen-nuoc", icon: "💧", name: "Chuyền nước", hint: "Tối thiểu 5 người" },
  { id: "thoi-trang", apiId: "thoi-trang", icon: "👗", name: "Thiết kế & trình diễn thời trang", hint: "Đăng ký đội" },
  { id: "van-nghe", apiId: "hoi-dien-van-nghe", icon: "🎤", name: "Hội diễn văn nghệ", hint: "Mỗi lần đăng ký 1 tiết mục" }
];

const rules = {
  "cam-hoa": { total: 3 },
  "keo-co": { total: 8, gender: { Nam: 4, "Nữ": 4 } },
  "nhay-bao-bo": { total: 4, gender: { Nam: 2, "Nữ": 2 } },
  "chuyen-nuoc": { total: 5 }
};

const container = document.getElementById("activities");

activities.forEach(a => {
  const el = document.createElement("button");
  el.className = "activity";
  el.type = "button";
  el.innerHTML = `
    <span class="icon">${a.icon}</span>
    <span class="name">${a.name}</span>
    <div class="hint">${a.hint}</div>
  `;
  el.onclick = () => openActivity(a.id);
  container.appendChild(el);
});

function openActivity(id) {
  const activity = activities.find(a => a.id === id);
  const rule = rules[id] || {};

  const memberCount = rule.total ? Math.max(rule.total - 1, 0) : 0;

  let content = `
    <form id="registrationForm" novalidate>
      <input type="hidden" name="activity" value="${activity.apiId}">
      <h2 class="form-title">${activity.icon} Đăng ký ${activity.name}</h2>

      <label>CHI ĐOÀN ĐĂNG KÝ <span class="req">*</span></label>
      <input name="chiDoan" required placeholder="Nhập tên chi đoàn">

      <div class="section-title">TRƯỞNG NHÓM</div>

      <label>Họ tên <span class="req">*</span></label>
      <input name="leaderName" required placeholder="Họ và tên">

      <label>Lớp <span class="req">*</span></label>
      <input name="leaderClass" required placeholder="Ví dụ: CĐ...">

      <label>Giới tính <span class="req">*</span></label>
      <select name="leaderGender" required>
        <option value="">-- Chọn giới tính --</option>
        <option value="Nam">Nam</option>
        <option value="Nữ">Nữ</option>
      </select>

      <label>Số điện thoại <span class="req">*</span></label>
      <input name="leaderPhone" type="tel" required pattern="0[0-9]{9,10}" placeholder="0xxxxxxxxx">

      ${id === "van-nghe" ? `
        <div class="section-title">THÔNG TIN TIẾT MỤC</div>

        <label>Tên tiết mục <span class="req">*</span></label>
        <input name="tenTietMuc" required placeholder="Nhập tên tiết mục">

        <label>Thể loại <span class="req">*</span></label>
        <select name="theLoai" required>
          <option value="">-- Chọn thể loại --</option>
          <option>Hát</option>
          <option>Múa</option>
          <option>Tốp ca</option>
          <option>Hát múa</option>
          <option>Khác</option>
        </select>

        <label>Tác giả</label>
        <input name="tacGia" placeholder="Nhập tên tác giả">
      ` : ""}

      <div class="section-title">NGƯỜI THAM GIA</div>
      <div id="members"></div>
      <button type="button" class="add-member" onclick="addMember()">＋ Thêm thành viên</button>

      ${ruleNote(id)}

      ${id === "van-nghe" ? `
        <label>LINK BEAT NHẠC <span class="req">*</span></label>
        <input name="linkBeat" type="url" required placeholder="https://...">
        <div class="note">Mỗi lần gửi là 1 tiết mục. Đăng ký xong có thể bấm “Đăng ký thêm tiết mục”.</div>
      ` : ""}

      <div id="formMessage" class="form-message" aria-live="polite"></div>
      <button type="submit" class="submit">ĐĂNG KÝ</button>
    </form>
  `;

  document.getElementById("modalContent").innerHTML = content;
  document.getElementById("modal").classList.remove("hidden");

  for (let i = 0; i < memberCount; i++) addMember(true);

  const form = document.getElementById("registrationForm");
  form.dataset.activity = id;
  form.addEventListener("submit", event => submitRegistration(event, id));
}

function ruleNote(id) {
  const notes = {
    "keo-co": "Yêu cầu cơ cấu: ít nhất 4 Nam + 4 Nữ. Trưởng nhóm cũng được tính vào cơ cấu.",
    "nhay-bao-bo": "Yêu cầu cơ cấu: ít nhất 2 Nam + 2 Nữ. Trưởng nhóm cũng được tính vào cơ cấu.",
    "cam-hoa": "Tối thiểu 3 người, tính cả trưởng nhóm.",
    "chuyen-nuoc": "Tối thiểu 5 người, tính cả trưởng nhóm."
  };
  return notes[id] ? `<div class="note">${notes[id]}</div>` : "";
}

function addMember(requiredBlock = false) {
  const box = document.getElementById("members");
  if (!box) return;

  const index = box.children.length + 1;
  const member = document.createElement("div");
  member.className = "member";
  member.dataset.memberIndex = index;

  member.innerHTML = `
    <strong>Thành viên ${index}</strong>
    <div class="member-grid">
      <div>
        <label>Họ tên <span class="req">*</span></label>
        <input name="member_${index}_name" ${requiredBlock ? "required" : ""} placeholder="Họ và tên">
      </div>
      <div>
        <label>Lớp <span class="req">*</span></label>
        <input name="member_${index}_class" ${requiredBlock ? "required" : ""} placeholder="Lớp">
      </div>
      <div>
        <label>Giới tính <span class="req">*</span></label>
        <select name="member_${index}_gender" ${requiredBlock ? "required" : ""}>
          <option value="">-- Chọn --</option>
          <option value="Nam">Nam</option>
          <option value="Nữ">Nữ</option>
        </select>
      </div>
    </div>
  `;
  box.appendChild(member);
}

function collectFormData(form) {
  const activity = form.elements.activity.value;
  const members = Array.from(form.querySelectorAll(".member")).map(block => {
    const index = block.dataset.memberIndex;
    return {
      hoTen: form.elements[`member_${index}_name`]?.value.trim() || "",
      lop: form.elements[`member_${index}_class`]?.value.trim() || "",
      gioiTinh: form.elements[`member_${index}_gender`]?.value || ""
    };
  });

  return {
    activity,
    chiDoan: form.elements.chiDoan.value.trim(),
    leader: {
      hoTen: form.elements.leaderName.value.trim(),
      lop: form.elements.leaderClass.value.trim(),
      gioiTinh: form.elements.leaderGender.value,
      soDienThoai: form.elements.leaderPhone.value.trim()
    },
    tenTietMuc: form.elements.tenTietMuc?.value.trim() || "",
    theLoai: form.elements.theLoai?.value || "",
    tacGia: form.elements.tacGia?.value.trim() || "",
    linkBeat: form.elements.linkBeat?.value.trim() || "",
    members
  };
}

function validateBusinessRules(data, id) {
  const rule = rules[id];

  if (!rule) return true;

  const totalPeople = 1 + data.members.length;

  if (rule.total && totalPeople < rule.total) {
    showMessage(`Hoạt động này cần ít nhất ${rule.total} người, tính cả trưởng nhóm.`, "error");
    return false;
  }

  if (rule.gender) {
    const counts = { Nam: 0, "Nữ": 0 };
    if (data.leader.gioiTinh in counts) counts[data.leader.gioiTinh]++;

    data.members.forEach(m => {
      if (m.gioiTinh in counts) counts[m.gioiTinh]++;
    });

    if (counts.Nam < rule.gender.Nam || counts["Nữ"] < rule.gender["Nữ"]) {
      showMessage(
        `Cơ cấu chưa đủ: cần ít nhất ${rule.gender.Nam} Nam và ${rule.gender["Nữ"]} Nữ. Hiện có ${counts.Nam} Nam, ${counts["Nữ"]} Nữ.`,
        "error"
      );
      return false;
    }
  }

  return true;
}

async function submitRegistration(event, id) {
  event.preventDefault();

  const form = event.currentTarget;
  const message = document.getElementById("formMessage");

  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const data = collectFormData(form);

  if (!validateBusinessRules(data, id)) return;

  const submitButton = form.querySelector(".submit");
  submitButton.disabled = true;
  submitButton.textContent = "ĐANG LƯU...";

  showMessage("Đang gửi đăng ký lên Google Sheets...", "info");

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8"
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || "Không thể lưu đăng ký.");
    }

    form.innerHTML = `
      <div class="success-box">
        <div class="success-icon">✓</div>
        <h2>ĐĂNG KÝ THÀNH CÔNG</h2>
        <p>Thông tin đã được lưu vào hệ thống.</p>
        <p><strong>Mã đăng ký:</strong> ${result.registrationId || "Đã ghi nhận"}</p>
        ${id === "van-nghe" ? `
          <button type="button" class="submit" onclick="openActivity('van-nghe')">
            🎤 ĐĂNG KÝ THÊM TIẾT MỤC
          </button>
        ` : `
          <button type="button" class="submit" onclick="closeModal()">ĐÓNG</button>
        `}
      </div>
    `;

  } catch (error) {
    console.error(error);
    showMessage(
      "Chưa lưu được dữ liệu. Kiểm tra kết nối Apps Script hoặc quyền triển khai rồi thử lại.",
      "error"
    );
    submitButton.disabled = false;
    submitButton.textContent = "ĐĂNG KÝ";
  }
}

function showMessage(text, type) {
  const el = document.getElementById("formMessage");
  if (!el) return;
  el.className = `form-message ${type || ""}`;
  el.textContent = text;
}

function openList() {
  window.location.href = "https://docs.google.com/spreadsheets/d/16z9cBodV34NjeQogOMVISWnznzE1qubORet69vljo_Y/edit?usp=sharing";
}

async function fetchRegistrations(activity = "") {
  try {
    const url = activity
      ? `${API_URL}?action=list&activity=${encodeURIComponent(activity)}`
      : `${API_URL}?action=list`;

    const response = await fetch(url);
    const result = await response.json();
    return Array.isArray(result) ? result : [];
  } catch (error) {
    console.error(error);
    return [];
  }
}

function renderRegistrationList(list, keyword = "") {
  const box = document.getElementById("registrationList");
  if (!box) return;

  const q = keyword.trim().toLowerCase();

  const filtered = list.filter(item => {
    if (!q) return true;
    return Object.values(item).some(value =>
      String(value ?? "").toLowerCase().includes(q)
    );
  });

  if (!filtered.length) {
    box.innerHTML = `<div class="note">Chưa có đăng ký phù hợp.</div>`;
    return;
  }

  box.innerHTML = filtered.map(item => `
    <div class="registration-item">
      <strong>${escapeHtml(item["Chi đoàn đăng ký"] || "Chưa có chi đoàn")}</strong>
      <div>${escapeHtml(item["Tên tiết mục"] || item.activityName || "")}</div>
      <small>Mã: ${escapeHtml(item["Mã đăng ký"] || "")}</small>
    </div>
  `).join("");
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function closeModal() {
  document.getElementById("modal").classList.add("hidden");
}

document.getElementById("modal").addEventListener("click", e => {
  if (e.target.id === "modal") closeModal();
});
