    </div><!-- .page-body -->
  </main><!-- .main-content -->
</div><!-- .admin-layout -->

<!-- Modal container (shared) -->
<div class="modal-overlay" id="modal-overlay" onclick="if(event.target===this) closeModal()">
  <div class="modal" id="modal">
    <div class="modal-header">
      <h3 id="modal-title">Modal</h3>
      <button class="modal-close" onclick="closeModal()">✕</button>
    </div>
    <div class="modal-body" id="modal-body"></div>
    <div class="modal-footer" id="modal-footer"></div>
  </div>
</div>

<script src="/assets/js/admin.js"></script>
<?php if (!empty($pageScript)): ?>
<script><?= $pageScript ?></script>
<?php endif; ?>
</body>
</html>
